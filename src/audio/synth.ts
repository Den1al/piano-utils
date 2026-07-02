import type { NoteName } from '../data/notes'
import { noteIndex } from '../data/notes'

let audioCtx: AudioContext | null = null
let reverbNode: ConvolverNode | null = null
let reverbGain: GainNode | null = null
let dryGain: GainNode | null = null
let masterGain: GainNode | null = null
let activeSources: AudioBufferSourceNode[] = []
let activeOscillators: OscillatorNode[] = []

const sampleCache = new Map<string, AudioBuffer>()
const loadingPromises = new Map<string, Promise<AudioBuffer | null>>()

const NOTE_MAP: Record<NoteName, string> = {
  'C': 'C', 'C#': 'Db', 'D': 'D', 'D#': 'Eb', 'E': 'E',
  'F': 'F', 'F#': 'Gb', 'G': 'G', 'G#': 'Ab', 'A': 'A',
  'A#': 'Bb', 'B': 'B',
}

const SOUNDFONT_URL = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_grand_piano-mp3'

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
    setupReverb(audioCtx)
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function setupReverb(ctx: AudioContext) {
  const length = ctx.sampleRate * 1.8
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-(i / ctx.sampleRate) * 3.5)
    }
  }
  reverbNode = ctx.createConvolver()
  reverbNode.buffer = impulse
  reverbGain = ctx.createGain()
  reverbGain.gain.value = 0.15
  dryGain = ctx.createGain()
  dryGain.gain.value = 0.85
  masterGain = ctx.createGain()
  masterGain.gain.value = 1
  reverbNode.connect(reverbGain!)
  reverbGain!.connect(masterGain)
  dryGain!.connect(masterGain)
  masterGain.connect(ctx.destination)
}

function stopAll() {
  activeSources.forEach(s => { try { s.stop() } catch {} })
  activeOscillators.forEach(o => { try { o.stop() } catch {} })
  activeSources = []
  activeOscillators = []
  if (masterGain) {
    masterGain.gain.setValueAtTime(0, masterGain.context.currentTime)
    masterGain.gain.linearRampToValueAtTime(1, masterGain.context.currentTime + 0.05)
  }
}

function semitonesToFrequency(rootNote: NoteName, rootOctave: number, semitones: number): number {
  const rootSemitones = noteIndex(rootNote) - noteIndex('A') + (rootOctave - 4) * 12
  return 440 * Math.pow(2, (rootSemitones + semitones) / 12)
}

function noteNameForSample(note: NoteName, octave: number): string {
  return `${NOTE_MAP[note]}${octave}`
}

async function loadSample(note: NoteName, octave: number): Promise<AudioBuffer | null> {
  const ctx = getAudioContext()
  const name = noteNameForSample(note, octave)

  if (sampleCache.has(name)) return sampleCache.get(name)!
  if (loadingPromises.has(name)) return loadingPromises.get(name)!

  const promise = fetch(`${SOUNDFONT_URL}/${name}.mp3`)
    .then(r => r.arrayBuffer())
    .then(buf => ctx.decodeAudioData(buf))
    .then(decoded => {
      sampleCache.set(name, decoded)
      return decoded
    })
    .catch(() => null)

  loadingPromises.set(name, promise)
  return promise
}

function getNoteAndOctave(root: NoteName, rootOctave: number, semitones: number): { note: NoteName; octave: number } {
  const rootIdx = noteIndex(root)
  const totalSemitones = rootIdx + semitones
  const noteIdx = ((totalSemitones % 12) + 12) % 12
  const octaveOffset = Math.floor(totalSemitones / 12) - Math.floor(rootIdx / 12)
  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return { note: notes[noteIdx], octave: rootOctave + octaveOffset }
}

function playSample(ctx: AudioContext, buffer: AudioBuffer, startTime: number, duration: number, volume: number) {
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, startTime)
  // Fade out before the end to avoid clicks
  const fadeStart = startTime + Math.max(0, duration - 0.05)
  gain.gain.setValueAtTime(volume, fadeStart)
  gain.gain.linearRampToValueAtTime(0, fadeStart + 0.05)

  source.connect(gain)
  if (dryGain && reverbNode) {
    gain.connect(dryGain)
    gain.connect(reverbNode)
  } else {
    gain.connect(ctx.destination)
  }
  source.start(startTime)
  source.stop(startTime + duration + 0.1)
  activeSources.push(source)
  source.onended = () => {
    const idx = activeSources.indexOf(source)
    if (idx >= 0) activeSources.splice(idx, 1)
  }
}

// Fallback oscillator for when samples haven't loaded yet
function playFallbackTone(ctx: AudioContext, frequency: number, startTime: number, duration: number, volume: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency
  osc.connect(gain)
  if (dryGain) {
    gain.connect(dryGain)
  } else {
    gain.connect(ctx.destination)
  }
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration)
  activeOscillators.push(osc)
  osc.onended = () => {
    const idx = activeOscillators.indexOf(osc)
    if (idx >= 0) activeOscillators.splice(idx, 1)
  }
}

const liveNotes = new Map<string, { source: AudioBufferSourceNode; gain: GainNode }>()

export function playNoteStart(note: NoteName, octave: number) {
  const ctx = getAudioContext()
  const key = `${note}${octave}`
  const existing = liveNotes.get(key)
  if (existing) {
    try { existing.source.stop() } catch {}
    liveNotes.delete(key)
  }

  const cached = sampleCache.get(noteNameForSample(note, octave))
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.7, ctx.currentTime)

  if (cached) {
    const source = ctx.createBufferSource()
    source.buffer = cached
    source.connect(gain)
    if (dryGain && reverbNode) {
      gain.connect(dryGain)
      gain.connect(reverbNode)
    } else {
      gain.connect(ctx.destination)
    }
    source.start()
    liveNotes.set(key, { source, gain })
    source.onended = () => liveNotes.delete(key)
  } else {
    const freq = 440 * Math.pow(2, (noteIndex(note) - noteIndex('A') + (octave - 4) * 12) / 12)
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(gain)
    if (dryGain) {
      gain.connect(dryGain)
    } else {
      gain.connect(ctx.destination)
    }
    osc.start()
    liveNotes.set(key, { source: osc as unknown as AudioBufferSourceNode, gain })
    loadSample(note, octave)
  }
}

export function playNoteStop(note: NoteName, octave: number) {
  const key = `${note}${octave}`
  const entry = liveNotes.get(key)
  if (!entry) return
  const ctx = getAudioContext()
  entry.gain.gain.setValueAtTime(entry.gain.gain.value, ctx.currentTime)
  entry.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
  setTimeout(() => {
    try { entry.source.stop() } catch {}
    liveNotes.delete(key)
  }, 350)
}

export function preloadAllKeys(startOctave = 4, octaves = 2) {
  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  for (let o = 0; o < octaves; o++) {
    for (const note of notes) {
      loadSample(note, startOctave + o)
    }
  }
}

export async function preloadNotes(root: NoteName, intervals: number[], octave = 4) {
  const notes = intervals.map(s => getNoteAndOctave(root, octave, s))
  await Promise.all(notes.map(n => loadSample(n.note, n.octave)))
}

export function playIntervalSequence(root: NoteName, intervals: number[], octave = 4, tempo = 200): Promise<void> {
  stopAll()
  const ctx = getAudioContext()
  const step = tempo / 1000
  const noteDuration = Math.max(step * 2, 0.8)
  const now = ctx.currentTime

  // Start playback immediately with whatever is cached, load the rest
  const noteInfos = intervals.map(s => getNoteAndOctave(root, octave, s))

  noteInfos.forEach(({ note, octave: oct }, i) => {
    const cached = sampleCache.get(noteNameForSample(note, oct))
    if (cached) {
      playSample(ctx, cached, now + i * step, noteDuration, 0.7)
    } else {
      // Play fallback and load for next time
      const freq = semitonesToFrequency(root, octave, intervals[i])
      playFallbackTone(ctx, freq, now + i * step, noteDuration, 0.2)
      loadSample(note, oct)
    }
  })

  return new Promise(resolve => {
    setTimeout(resolve, intervals.length * step * 1000 + 300)
  })
}

export function playChordFromIntervals(root: NoteName, intervals: number[], octave = 4, duration = 2.0) {
  stopAll()
  const ctx = getAudioContext()
  const now = ctx.currentTime
  const volume = 0.6 / Math.sqrt(intervals.length)

  intervals.forEach(semitones => {
    const { note, octave: oct } = getNoteAndOctave(root, octave, semitones)
    const cached = sampleCache.get(noteNameForSample(note, oct))
    if (cached) {
      playSample(ctx, cached, now, duration, volume)
    } else {
      const freq = semitonesToFrequency(root, octave, semitones)
      playFallbackTone(ctx, freq, now, duration, 0.15)
      loadSample(note, oct)
    }
  })
}

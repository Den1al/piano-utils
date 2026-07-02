import { useState } from 'react'
import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import CircleOfFifths from '../components/CircleOfFifths'
import { getScaleNotes, noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { SCALES } from '../data/scales'
import { CHORDS } from '../data/chords'
import { DIATONIC_CHORD_QUALITIES, KEY_SIGNATURES, RELATIVE_MINORS } from '../data/theory'

const CHORD_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#6366f1', '#f97316']

interface CirclePageProps {
  selectedRoot: NoteName
  onRootChange: (root: NoteName) => void
}

function getKeySignatureLabel(key: NoteName): string {
  const sig = KEY_SIGNATURES[key]
  if (sig.sharps === 0 && sig.flats === 0) return '0 sharps, 0 flats'
  if (sig.sharps > 0) return `${sig.sharps} sharp${sig.sharps > 1 ? 's' : ''}`
  return `${sig.flats} flat${sig.flats > 1 ? 's' : ''}`
}

export default function CirclePage({ selectedRoot, onRootChange }: CirclePageProps) {
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(null)

  const majorScale = SCALES.find(s => s.name === 'Major')!
  const scaleNotes = getScaleNotes(selectedRoot, majorScale.intervals)
  const relativeMinor = RELATIVE_MINORS[selectedRoot]

  // Compute diatonic chords
  const diatonicChords = DIATONIC_CHORD_QUALITIES.map((dq, i) => {
    const chordRootIndex = (noteIndex(selectedRoot) + dq.intervalFromRoot) % 12
    const chordRoot = noteFromIndex(chordRootIndex)
    const chordDef = CHORDS.find(c => c.name === dq.quality)
    const symbol = chordDef?.symbol ?? ''
    return {
      numeral: dq.numeral,
      name: `${chordRoot}${symbol}`,
      root: chordRoot,
      quality: dq.quality,
      intervals: chordDef?.intervals ?? [0, 4, 7],
      color: CHORD_COLORS[i],
    }
  })

  // Compute highlights
  let highlights: KeyHighlight[]
  if (selectedChordIndex !== null) {
    const chord = diatonicChords[selectedChordIndex]
    const rootIdx = noteIndex(chord.root)
    highlights = chord.intervals.map((interval) => ({
      note: noteFromIndex(rootIdx + interval),
      color: chord.color,
    }))
  } else {
    highlights = scaleNotes.map((note, i) => ({
      note,
      color: CHORD_COLORS[i % CHORD_COLORS.length],
    }))
  }

  function handleSelectKey(key: NoteName) {
    setSelectedChordIndex(null)
    onRootChange(key)
  }

  function handleChordTap(index: number) {
    setSelectedChordIndex(prev => prev === index ? null : index)
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Circle of Fifths */}
      <div className="w-full max-w-[350px] mx-auto">
        <CircleOfFifths selectedKey={selectedRoot} onSelectKey={handleSelectKey} />
      </div>

      {/* Key info */}
      <div className="text-center space-y-1">
        <p className="text-white text-lg font-semibold">
          {selectedRoot} Major — {getKeySignatureLabel(selectedRoot)}
        </p>
        <p className="text-white/60 text-sm">
          Relative minor: {relativeMinor}m
        </p>
      </div>

      {/* Diatonic chords */}
      <div className="flex gap-2 justify-center flex-wrap">
        {diatonicChords.map((chord, i) => {
          const isActive = selectedChordIndex === i
          return (
            <button
              key={chord.numeral}
              onClick={() => handleChordTap(i)}
              className="flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium backdrop-blur border transition-all duration-200"
              style={{
                background: isActive ? chord.color + '30' : 'rgba(255,255,255,0.06)',
                borderColor: isActive ? chord.color + '80' : 'rgba(255,255,255,0.1)',
                boxShadow: isActive ? `0 0 12px ${chord.color}30` : 'none',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
              }}
            >
              <span className="text-xs opacity-60">{chord.numeral}</span>
              <span>{chord.name}</span>
            </button>
          )
        })}
      </div>

      {/* Piano keyboard */}
      <div className="w-full max-w-3xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>
    </div>
  )
}

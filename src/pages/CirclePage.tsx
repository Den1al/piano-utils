import { useState } from 'react'
import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import CircleOfFifths from '../components/CircleOfFifths'
import PageHint from '../components/PageHint'
import PlayButton from '../components/PlayButton'
import { getScaleNotes, noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { SCALES } from '../data/scales'
import { CHORDS, INTERVAL_LABELS } from '../data/chords'
import { DIATONIC_CHORD_QUALITIES, KEY_SIGNATURES, RELATIVE_MINORS } from '../data/theory'
import { SCALE_DEGREE_COLORS, INTERVAL_COLORS } from '../data/colors'
import { playIntervalSequence, playChordFromIntervals } from '../audio/synth'

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
      color: SCALE_DEGREE_COLORS[i],
    }
  })

  let highlights: KeyHighlight[]
  if (selectedChordIndex !== null) {
    const chord = diatonicChords[selectedChordIndex]
    const rootIdx = noteIndex(chord.root)
    highlights = chord.intervals.map((interval) => {
      const label = INTERVAL_LABELS[interval % 12] ?? ''
      return {
        note: noteFromIndex(rootIdx + interval),
        color: INTERVAL_COLORS[label] ?? chord.color,
        label,
      }
    })
  } else {
    highlights = scaleNotes.map((note, i) => ({
      note,
      color: SCALE_DEGREE_COLORS[i % SCALE_DEGREE_COLORS.length],
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
    <div className="animate-fade-in flex flex-col gap-4 p-4">
      {/* Circle + key info side by side */}
      <div className="flex items-center gap-4">
        <div className="w-[200px] md:w-[280px] shrink-0">
          <CircleOfFifths selectedKey={selectedRoot} onSelectKey={handleSelectKey} />
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div>
            <p className="text-white text-lg font-semibold">
              {selectedRoot} Major
            </p>
            <p className="text-white/50 text-sm">
              {getKeySignatureLabel(selectedRoot)}
            </p>
            <p className="text-white/50 text-sm">
              Relative minor: {relativeMinor}m
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {diatonicChords.map((chord, i) => {
              const isActive = selectedChordIndex === i
              return (
                <button
                  key={chord.numeral}
                  onClick={() => handleChordTap(i)}
                  className="flex flex-col items-center px-2 py-1 rounded-lg text-sm font-medium backdrop-blur border transition-all duration-200"
                  style={{
                    background: isActive ? chord.color + '30' : 'rgba(255,255,255,0.06)',
                    borderColor: isActive ? chord.color + '80' : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? `0 0 12px ${chord.color}30` : 'none',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <span className="text-[10px] opacity-60">{chord.numeral}</span>
                  <span className="text-xs">{chord.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hint + Play */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <PageHint text="Tap a key on the circle to select it. Tap a chord to see its notes on the keyboard." />
        </div>
        <PlayButton
          label={selectedChordIndex !== null ? 'Play Chord' : 'Play Scale'}
          onPlay={() => {
            if (selectedChordIndex !== null) {
              const chord = diatonicChords[selectedChordIndex]
              playChordFromIntervals(chord.root, chord.intervals)
            } else {
              return playIntervalSequence(selectedRoot, [...majorScale.intervals, 12])
            }
          }}
        />
      </div>

      {/* Piano keyboard */}
      <div className="w-full max-w-xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import ChordSelector from '../components/ChordSelector'
import HandToggle from '../components/HandToggle'
import PageHint from '../components/PageHint'
import PlayButton from '../components/PlayButton'
import { noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { CHORDS, INTERVAL_LABELS } from '../data/chords'
import { INTERVAL_COLORS, CHORD_LEGEND } from '../data/colors'
import { playIntervalSequence, preloadNotes } from '../audio/synth'

interface ArpeggiosPageProps {
  selectedRoot: NoteName
  selectedChord: string
  onChordChange: (chord: string) => void
  hand: 'rh' | 'lh'
  onHandChange: (hand: 'rh' | 'lh') => void
}

export default function ArpeggiosPage({
  selectedRoot,
  selectedChord,
  onChordChange,
  hand,
  onHandChange,
}: ArpeggiosPageProps) {
  const chordDef = CHORDS.find(c => c.name === selectedChord) ?? CHORDS[0]
  const rootIdx = noteIndex(selectedRoot)

  const twoOctaveIntervals = [
    ...chordDef.intervals,
    ...chordDef.intervals.map(i => i + 12),
  ]

  useEffect(() => {
    preloadNotes(selectedRoot, twoOctaveIntervals)
  }, [selectedRoot, selectedChord])

  const arpNotes = twoOctaveIntervals.map(interval => noteFromIndex(rootIdx + interval))

  // Color by interval function (same as chords page), label with sequence number
  const highlights: KeyHighlight[] = arpNotes.map((note, i) => {
    const interval = twoOctaveIntervals[i] % 12
    const label = INTERVAL_LABELS[interval] ?? 'R'
    return {
      note,
      color: INTERVAL_COLORS[label] ?? '#3b82f6',
      label: String(i + 1),
    }
  })

  const ascending = arpNotes
  const descending = [...arpNotes].reverse()

  // Colors for note chips — same interval-based colors
  function getChipColor(i: number): string {
    const interval = twoOctaveIntervals[i] % 12
    const label = INTERVAL_LABELS[interval] ?? 'R'
    return INTERVAL_COLORS[label] ?? '#3b82f6'
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4 p-4">
      {/* Top: ChordSelector + HandToggle */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <ChordSelector selected={selectedChord} onSelect={onChordChange} />
        </div>
        <div className="flex-shrink-0 pt-4">
          <HandToggle hand={hand} onToggle={onHandChange} />
        </div>
      </div>

      {/* Hint */}
      <PageHint
        text="Numbers show playing order across 2 octaves. Same chord tones repeat in the second octave."
        legend={CHORD_LEGEND.slice(0, chordDef.intervals.length)}
      />

      {/* Piano keyboard */}
      <div className="w-full max-w-xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>

      {/* Play buttons */}
      <div className="flex justify-center gap-3">
        <PlayButton label="Ascending" onPlay={() => playIntervalSequence(selectedRoot, twoOctaveIntervals, 4, 180)} />
        <PlayButton label="Asc + Desc" onPlay={() => {
          const descIntervals = [...twoOctaveIntervals].reverse()
          return playIntervalSequence(selectedRoot, [...twoOctaveIntervals, ...descIntervals], 4, 180)
        }} />
      </div>

      {/* Bottom: Ascending / Descending rows */}
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1 text-center">
            Ascending
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {ascending.map((note, i) => (
              <span
                key={`asc-${i}`}
                className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
                style={{
                  borderColor: getChipColor(i) + '80',
                  boxShadow: `0 0 8px ${getChipColor(i)}30`,
                }}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1 text-center">
            Descending
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {descending.map((note, i) => {
              const originalIdx = arpNotes.length - 1 - i
              return (
                <span
                  key={`desc-${i}`}
                  className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
                  style={{
                    borderColor: getChipColor(originalIdx) + '80',
                    boxShadow: `0 0 8px ${getChipColor(originalIdx)}30`,
                  }}
                >
                  {note}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

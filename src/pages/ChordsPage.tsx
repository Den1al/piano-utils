import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import ChordSelector from '../components/ChordSelector'
import InversionToggle from '../components/InversionToggle'
import { noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { CHORDS, INTERVAL_LABELS, getInversion } from '../data/chords'

const CHORD_COLORS = ['#3b82f6', '#ec4899', '#14b8a6', '#f59e0b']

interface ChordsPageProps {
  selectedRoot: NoteName
  selectedChord: string
  onChordChange: (chord: string) => void
  inversion: number
  onInversionChange: (inv: number) => void
}

export default function ChordsPage({
  selectedRoot,
  selectedChord,
  onChordChange,
  inversion,
  onInversionChange,
}: ChordsPageProps) {
  const chordDef = CHORDS.find(c => c.name === selectedChord) ?? CHORDS[0]
  const maxInversion = chordDef.intervals.length - 1

  // Reset inversion if it exceeds the new chord's max
  const safeInversion = inversion > maxInversion ? 0 : inversion

  const invertedIntervals = getInversion(chordDef.intervals, safeInversion)
  const rootIdx = noteIndex(selectedRoot)

  const notes = invertedIntervals.map(interval => noteFromIndex(rootIdx + interval))
  const intervalLabels = invertedIntervals.map(interval => INTERVAL_LABELS[interval % 12] ?? String(interval))

  const highlights: KeyHighlight[] = notes.map((note, i) => ({
    note,
    color: CHORD_COLORS[i % CHORD_COLORS.length],
    label: intervalLabels[i],
  }))

  function handleChordChange(chord: string) {
    const newChordDef = CHORDS.find(c => c.name === chord)
    if (newChordDef && inversion > newChordDef.intervals.length - 1) {
      onInversionChange(0)
    }
    onChordChange(chord)
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-4">
      {/* Top: ChordSelector */}
      <ChordSelector selected={selectedChord} onSelect={handleChordChange} />

      {/* Middle: InversionToggle */}
      <div className="flex justify-center">
        <InversionToggle
          inversion={safeInversion}
          maxInversion={maxInversion}
          onSelect={onInversionChange}
        />
      </div>

      {/* Piano keyboard */}
      <div className="w-full max-w-xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>

      {/* Bottom: Interval breakdown chips */}
      <div className="flex gap-2 justify-center flex-wrap">
        {notes.map((note, i) => (
          <span
            key={`${note}-${i}`}
            className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
            style={{
              borderColor: CHORD_COLORS[i % CHORD_COLORS.length] + '80',
              boxShadow: `0 0 8px ${CHORD_COLORS[i % CHORD_COLORS.length]}30`,
            }}
          >
            {note} — {intervalLabels[i]}
          </span>
        ))}
      </div>
    </div>
  )
}

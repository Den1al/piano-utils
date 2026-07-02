import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import ChordSelector from '../components/ChordSelector'
import HandToggle from '../components/HandToggle'
import { noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { CHORDS } from '../data/chords'

const ARP_COLORS = ['#3b82f6', '#ec4899', '#14b8a6', '#f59e0b']

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

  // Compute arpeggio intervals across 2 octaves: original intervals + each interval shifted up 12
  const twoOctaveIntervals = [
    ...chordDef.intervals,
    ...chordDef.intervals.map(i => i + 12),
  ]

  // Map each interval to a note name
  const arpNotes = twoOctaveIntervals.map(interval => noteFromIndex(rootIdx + interval))

  // Build highlights: label with sequence number, color by chord tone position
  const highlights: KeyHighlight[] = arpNotes.map((note, i) => ({
    note,
    color: ARP_COLORS[i % chordDef.intervals.length],
    label: String(i + 1),
  }))

  // Ascending and descending note name sequences
  const ascending = arpNotes
  const descending = [...arpNotes].reverse()

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-4">
      {/* Top: ChordSelector + HandToggle */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <ChordSelector selected={selectedChord} onSelect={onChordChange} />
        </div>
        <div className="flex-shrink-0 pt-4">
          <HandToggle hand={hand} onToggle={onHandChange} />
        </div>
      </div>

      {/* Piano keyboard */}
      <div className="w-full max-w-3xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
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
                  borderColor: ARP_COLORS[i % chordDef.intervals.length] + '80',
                  boxShadow: `0 0 8px ${ARP_COLORS[i % chordDef.intervals.length]}30`,
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
              // Map back to chord tone position for consistent coloring
              const originalIdx = arpNotes.length - 1 - i
              return (
                <span
                  key={`desc-${i}`}
                  className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
                  style={{
                    borderColor: ARP_COLORS[originalIdx % chordDef.intervals.length] + '80',
                    boxShadow: `0 0 8px ${ARP_COLORS[originalIdx % chordDef.intervals.length]}30`,
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

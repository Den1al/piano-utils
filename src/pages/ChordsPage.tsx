import { useEffect } from 'react'
import PianoKeyboard from '../components/PianoKeyboard'
import type { KeyHighlight } from '../components/PianoKeyboard'
import ChordSelector from '../components/ChordSelector'
import InversionToggle from '../components/InversionToggle'
import PageHint from '../components/PageHint'
import PlayButton from '../components/PlayButton'
import { noteFromIndex, noteIndex } from '../data/notes'
import type { NoteName } from '../data/notes'
import { CHORDS, INTERVAL_LABELS, getInversion } from '../data/chords'
import { INTERVAL_COLORS, CHORD_LEGEND } from '../data/colors'
import { playChordFromIntervals, preloadNotes } from '../audio/synth'

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

  const safeInversion = inversion > maxInversion ? 0 : inversion

  const invertedIntervals = getInversion(chordDef.intervals, safeInversion)
  const rootIdx = noteIndex(selectedRoot)

  useEffect(() => {
    preloadNotes(selectedRoot, invertedIntervals)
  }, [selectedRoot, selectedChord, safeInversion])

  const notes = invertedIntervals.map(interval => noteFromIndex(rootIdx + interval))
  const intervalLabels = invertedIntervals.map(interval => INTERVAL_LABELS[interval % 12] ?? String(interval))

  const highlights: KeyHighlight[] = notes.map((note, i) => ({
    note,
    color: INTERVAL_COLORS[intervalLabels[i]] ?? '#3b82f6',
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
    <div className="animate-fade-in flex flex-col gap-4 p-4">
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

      {/* Hint */}
      <PageHint
        text="Labels on keys show intervals. Tap an inversion to shift the voicing."
        legend={CHORD_LEGEND.slice(0, chordDef.intervals.length)}
      />

      {/* Piano keyboard */}
      <div className="w-full max-w-xl mx-auto">
        <PianoKeyboard highlightedNotes={highlights} octaves={2} />
      </div>

      {/* Play button */}
      <div className="flex justify-center">
        <PlayButton label="Play Chord" onPlay={() => playChordFromIntervals(selectedRoot, invertedIntervals)} />
      </div>

      {/* Bottom: Interval breakdown chips */}
      <div className="flex gap-2 justify-center flex-wrap">
        {notes.map((note, i) => (
          <span
            key={`${note}-${i}`}
            className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 backdrop-blur border border-white/10 text-white"
            style={{
              borderColor: (INTERVAL_COLORS[intervalLabels[i]] ?? '#3b82f6') + '80',
              boxShadow: `0 0 8px ${INTERVAL_COLORS[intervalLabels[i]] ?? '#3b82f6'}30`,
            }}
          >
            {note} — {intervalLabels[i]}
          </span>
        ))}
      </div>
    </div>
  )
}

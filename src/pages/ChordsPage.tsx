import ChordSelector from '../components/ChordSelector'
import InversionToggle from '../components/InversionToggle'
import { CHORDS } from '../data/chords'

interface ChordsPageProps {
  selectedChord: string
  onChordChange: (chord: string) => void
  inversion: number
  onInversionChange: (inv: number) => void
}

export default function ChordsPage({
  selectedChord,
  onChordChange,
  inversion,
  onInversionChange,
}: ChordsPageProps) {
  const chordDef = CHORDS.find(c => c.name === selectedChord) ?? CHORDS[0]
  const maxInversion = chordDef.intervals.length - 1
  const safeInversion = inversion > maxInversion ? 0 : inversion

  function handleChordChange(chord: string) {
    const newChordDef = CHORDS.find(c => c.name === chord)
    if (newChordDef && inversion > newChordDef.intervals.length - 1) {
      onInversionChange(0)
    }
    onChordChange(chord)
  }

  return (
    <div className="flex items-start gap-4 px-4 py-2">
      <div className="flex-1 min-w-0">
        <ChordSelector selected={selectedChord} onSelect={handleChordChange} />
      </div>
      <div className="flex-shrink-0 pt-4">
        <InversionToggle
          inversion={safeInversion}
          maxInversion={maxInversion}
          onSelect={onInversionChange}
        />
      </div>
    </div>
  )
}

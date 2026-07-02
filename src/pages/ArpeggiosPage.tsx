import ChordSelector from '../components/ChordSelector'
import HandToggle from '../components/HandToggle'

interface ArpeggiosPageProps {
  selectedChord: string
  onChordChange: (chord: string) => void
  hand: 'rh' | 'lh'
  onHandChange: (hand: 'rh' | 'lh') => void
}

export default function ArpeggiosPage({
  selectedChord,
  onChordChange,
  hand,
  onHandChange,
}: ArpeggiosPageProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-2">
      <div className="flex-1 min-w-0">
        <ChordSelector selected={selectedChord} onSelect={onChordChange} />
      </div>
      <div className="flex-shrink-0 pt-4">
        <HandToggle hand={hand} onToggle={onHandChange} />
      </div>
    </div>
  )
}

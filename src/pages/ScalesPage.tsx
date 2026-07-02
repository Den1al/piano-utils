import ScaleSelector from '../components/ScaleSelector'
import HandToggle from '../components/HandToggle'

interface ScalesPageProps {
  selectedScale: string
  onScaleChange: (scale: string) => void
  hand: 'rh' | 'lh'
  onHandChange: (hand: 'rh' | 'lh') => void
}

export default function ScalesPage({
  selectedScale,
  onScaleChange,
  hand,
  onHandChange,
}: ScalesPageProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-2">
      <div className="flex-1 min-w-0">
        <ScaleSelector selected={selectedScale} onSelect={onScaleChange} />
      </div>
      <div className="flex-shrink-0 pt-4">
        <HandToggle hand={hand} onToggle={onHandChange} />
      </div>
    </div>
  )
}

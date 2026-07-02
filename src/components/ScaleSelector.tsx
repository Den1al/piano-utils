import { SCALES } from '../data/scales'

interface ScaleSelectorProps {
  selected: string
  onSelect: (scaleName: string) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  common: 'Common',
  mode: 'Modes',
  other: 'Other',
}

const CATEGORY_ORDER = ['common', 'mode', 'other'] as const

export default function ScaleSelector({ selected, onSelect }: ScaleSelectorProps) {
  const grouped = CATEGORY_ORDER.map(cat => ({
    label: CATEGORY_LABELS[cat],
    scales: SCALES.filter(s => s.category === cat),
  }))

  return (
    <div className="flex flex-col gap-2">
      {grouped.map(group => (
        <div key={group.label}>
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1">
            {group.scales.map(scale => (
              <button
                key={scale.name}
                onClick={() => onSelect(scale.name)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  scale.name === selected
                    ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
                    : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
                }`}
              >
                {scale.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

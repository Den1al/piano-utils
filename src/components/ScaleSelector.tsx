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
          <div className="text-xs text-white/50 font-medium mb-1">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1">
            {group.scales.map(scale => (
              <button
                key={scale.name}
                onClick={() => onSelect(scale.name)}
                className={`min-h-[32px] sm:min-h-[36px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
                  scale.name === selected
                    ? 'bg-[#0a84ff] text-white'
                    : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
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

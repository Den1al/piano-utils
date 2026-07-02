import { CHORDS } from '../data/chords'

interface ChordSelectorProps {
  selected: string
  onSelect: (chordName: string) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  triad: 'Triads',
  seventh: 'Sevenths',
  extended: 'Extended',
  suspended: 'Suspended',
}

const CATEGORY_ORDER = ['triad', 'seventh', 'extended', 'suspended'] as const

export default function ChordSelector({ selected, onSelect }: ChordSelectorProps) {
  const grouped = CATEGORY_ORDER.map(cat => ({
    label: CATEGORY_LABELS[cat],
    chords: CHORDS.filter(c => c.category === cat),
  }))

  return (
    <div className="flex flex-col gap-2">
      {grouped.map(group => (
        <div key={group.label}>
          <div className="text-xs text-white/50 font-medium mb-1">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1">
            {group.chords.map(chord => (
              <button
                key={chord.name}
                onClick={() => onSelect(chord.name)}
                className={`min-h-[32px] sm:min-h-[36px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
                  chord.name === selected
                    ? 'bg-[#0a84ff] text-white'
                    : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
                }`}
              >
                {chord.symbol === '' ? 'Maj' : chord.symbol}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

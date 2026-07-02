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
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {group.label}
          </div>
          <div className="flex flex-wrap gap-1">
            {group.chords.map(chord => (
              <button
                key={chord.name}
                onClick={() => onSelect(chord.name)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  chord.name === selected
                    ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
                    : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
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

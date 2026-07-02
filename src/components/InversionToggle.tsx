interface InversionToggleProps {
  inversion: number
  maxInversion: number
  onSelect: (inversion: number) => void
}

const LABELS = ['Root', '1st', '2nd', '3rd']

export default function InversionToggle({ inversion, maxInversion, onSelect }: InversionToggleProps) {
  return (
    <div className="flex gap-1">
      {LABELS.slice(0, maxInversion + 1).map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
            inversion === i
              ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
              : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

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
          className={`min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
            inversion === i
              ? 'bg-[#0a84ff] text-white'
              : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

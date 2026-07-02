interface HandToggleProps {
  hand: 'rh' | 'lh'
  onToggle: (hand: 'rh' | 'lh') => void
}

export default function HandToggle({ hand, onToggle }: HandToggleProps) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onToggle('lh')}
        className={`min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
          hand === 'lh'
            ? 'bg-[#0a84ff] text-white'
            : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
        }`}
      >
        LH
      </button>
      <button
        onClick={() => onToggle('rh')}
        className={`min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
          hand === 'rh'
            ? 'bg-[#0a84ff] text-white'
            : 'bg-white/[0.08] text-white/70 active:bg-white/[0.15]'
        }`}
      >
        RH
      </button>
    </div>
  )
}

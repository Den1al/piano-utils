interface HandToggleProps {
  hand: 'rh' | 'lh'
  onToggle: (hand: 'rh' | 'lh') => void
}

export default function HandToggle({ hand, onToggle }: HandToggleProps) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onToggle('rh')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          hand === 'rh'
            ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
            : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
        }`}
      >
        RH
      </button>
      <button
        onClick={() => onToggle('lh')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          hand === 'lh'
            ? 'bg-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20 text-white'
            : 'bg-white/10 backdrop-blur border border-transparent text-white/70 hover:bg-white/20'
        }`}
      >
        LH
      </button>
    </div>
  )
}

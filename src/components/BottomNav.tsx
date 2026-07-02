interface BottomNavProps {
  activeRoute: string
  onNavigate: (route: string) => void
  onCircleToggle: () => void
}

const tabs = [
  { route: 'scales', icon: '♪', label: 'Scales' },
  { route: 'chords', icon: '♫', label: 'Chords' },
  { route: 'arpeggios', icon: '♬', label: 'Arp' },
]

export default function BottomNav({ activeRoute, onNavigate, onCircleToggle }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(28,28,30,0.72)] backdrop-blur-xl backdrop-saturate-150 border-t border-white/[0.08]">
      <div className="flex items-center justify-around py-1">
        {tabs.map(tab => (
          <button
            key={tab.route}
            onClick={() => onNavigate(tab.route)}
            className={`flex flex-col items-center gap-0.5 min-w-[64px] min-h-[44px] justify-center rounded-lg transition-colors ${
              tab.route === activeRoute
                ? 'text-[#0a84ff]'
                : 'text-white/50 active:text-white/70'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={onCircleToggle}
          className="flex flex-col items-center gap-0.5 min-w-[64px] min-h-[44px] justify-center rounded-lg transition-colors text-white/50 active:text-white/70"
          title="Circle of Fifths"
        >
          <span className="text-xl">◎</span>
          <span className="text-[11px] font-medium">Circle</span>
        </button>
      </div>
    </div>
  )
}

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
    <>
      <button
        onClick={onCircleToggle}
        className="fixed bottom-[4rem] sm:bottom-[4.5rem] right-2 sm:right-4 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1c1c1e] border border-white/[0.08] text-white/60 active:text-white active:bg-[#2c2c2e] transition-colors flex items-center justify-center shadow-lg shadow-black/40"
        title="Circle of Fifths"
      >
        <span className="text-lg">◎</span>
      </button>

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
        </div>
      </div>
    </>
  )
}

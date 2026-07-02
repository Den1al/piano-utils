interface BottomNavProps {
  activeRoute: string
  onNavigate: (route: string) => void
}

const tabs = [
  { route: 'scales', icon: '♪', label: 'Scales' },
  { route: 'circle', icon: '◎', label: 'Circle' },
  { route: 'chords', icon: '♫', label: 'Chords' },
  { route: 'arpeggios', icon: '↗', label: 'Arp' },
]

export default function BottomNav({ activeRoute, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around py-2">
        {tabs.map(tab => (
          <button
            key={tab.route}
            onClick={() => onNavigate(tab.route)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-all ${
              tab.route === activeRoute
                ? 'text-white shadow-lg shadow-blue-500/10'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className={`text-xs font-medium ${
              tab.route === activeRoute ? 'text-blue-300' : ''
            }`}>
              {tab.label}
            </span>
            {tab.route === activeRoute && (
              <div className="w-6 h-0.5 bg-blue-400 rounded-full mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

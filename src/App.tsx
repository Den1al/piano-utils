import Layout from './components/Layout'
import { useHashRoute } from './hooks/useHashRoute'
import { useAppState } from './hooks/useAppState'

function App() {
  const [route, setRoute] = useHashRoute()
  const appState = useAppState()

  return (
    <Layout
      selectedRoot={appState.selectedRoot}
      onRootChange={appState.setSelectedRoot}
      activeRoute={route}
      onNavigate={setRoute}
    >
      <div className="p-4">
        {route === 'scales' && <div className="text-center text-white/50">Scale Explorer — coming soon</div>}
        {route === 'circle' && <div className="text-center text-white/50">Circle of Fifths — coming soon</div>}
        {route === 'chords' && <div className="text-center text-white/50">Chord Reference — coming soon</div>}
        {route === 'arpeggios' && <div className="text-center text-white/50">Arpeggio Patterns — coming soon</div>}
      </div>
    </Layout>
  )
}

export default App

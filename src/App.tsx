import Layout from './components/Layout'
import ScalesPage from './pages/ScalesPage'
import CirclePage from './pages/CirclePage'
import ChordsPage from './pages/ChordsPage'
import ArpeggiosPage from './pages/ArpeggiosPage'
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
      {route === 'scales' && (
        <div className="p-4">
          <ScalesPage
            selectedRoot={appState.selectedRoot}
            selectedScale={appState.selectedScale}
            onScaleChange={appState.setSelectedScale}
            hand={appState.hand}
            onHandChange={appState.setHand}
          />
        </div>
      )}
      {route === 'circle' && (
        <CirclePage
          selectedRoot={appState.selectedRoot}
          onRootChange={appState.setSelectedRoot}
        />
      )}
      {route === 'chords' && (
        <div className="p-4">
          <ChordsPage
            selectedRoot={appState.selectedRoot}
            selectedChord={appState.selectedChord}
            onChordChange={appState.setSelectedChord}
            inversion={appState.inversion}
            onInversionChange={appState.setInversion}
          />
        </div>
      )}
      {route === 'arpeggios' && (
        <div className="p-4">
          <ArpeggiosPage
            selectedRoot={appState.selectedRoot}
            selectedChord={appState.selectedChord}
            onChordChange={appState.setSelectedChord}
            hand={appState.hand}
            onHandChange={appState.setHand}
          />
        </div>
      )}
    </Layout>
  )
}

export default App

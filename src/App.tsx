import { useState } from 'react'
import Layout from './components/Layout'
import CircleOverlay from './components/CircleOverlay'
import ScalesPage from './pages/ScalesPage'
import ChordsPage from './pages/ChordsPage'
import ArpeggiosPage from './pages/ArpeggiosPage'
import { useHashRoute } from './hooks/useHashRoute'
import { useAppState } from './hooks/useAppState'

function App() {
  const [route, setRoute] = useHashRoute()
  const appState = useAppState()
  const [circleOpen, setCircleOpen] = useState(false)

  function handleChordFromCircle(quality: string) {
    appState.setSelectedChord(quality)
    setCircleOpen(false)
    setRoute('chords')
  }

  return (
    <Layout
      selectedRoot={appState.selectedRoot}
      onRootChange={appState.setSelectedRoot}
      activeRoute={route}
      onNavigate={setRoute}
      onCircleToggle={() => setCircleOpen(prev => !prev)}
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

      {circleOpen && (
        <CircleOverlay
          selectedRoot={appState.selectedRoot}
          onRootChange={appState.setSelectedRoot}
          onChordSelect={handleChordFromCircle}
          onClose={() => setCircleOpen(false)}
        />
      )}
    </Layout>
  )
}

export default App

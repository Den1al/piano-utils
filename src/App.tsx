import { useState, useEffect, useMemo } from 'react'
import Layout from './components/Layout'
import CircleOverlay from './components/CircleOverlay'
import PlayButton from './components/PlayButton'
import type { KeyHighlight } from './components/PianoKeyboard'
import ScalesPage from './pages/ScalesPage'
import ChordsPage from './pages/ChordsPage'
import ArpeggiosPage from './pages/ArpeggiosPage'
import { useHashRoute } from './hooks/useHashRoute'
import { useAppState } from './hooks/useAppState'
import { getScaleNotes, noteFromIndex, noteIndex } from './data/notes'
import { SCALES, MAJOR_SCALE_FINGERINGS, getDefaultFingering } from './data/scales'
import { CHORDS, INTERVAL_LABELS, getInversion } from './data/chords'
import { SCALE_DEGREE_COLORS, SCALE_LEGEND, INTERVAL_COLORS, CHORD_LEGEND } from './data/colors'
import { preloadNotes, playIntervalSequence, playChordFromIntervals } from './audio/synth'

function App() {
  const [route, setRoute] = useHashRoute()
  const appState = useAppState()
  const [circleOpen, setCircleOpen] = useState(false)

  const scaleDef = SCALES.find(s => s.name === appState.selectedScale) ?? SCALES[0]
  const chordDef = CHORDS.find(c => c.name === appState.selectedChord) ?? CHORDS[0]
  const maxInversion = chordDef.intervals.length - 1
  const safeInversion = appState.inversion > maxInversion ? 0 : appState.inversion
  const invertedIntervals = getInversion(chordDef.intervals, safeInversion)
  const twoOctaveIntervals = [...chordDef.intervals, ...chordDef.intervals.map(i => i + 12)]

  const highlights = useMemo((): KeyHighlight[] => {
    if (route === 'scales') {
      const scaleNotes = getScaleNotes(appState.selectedRoot, scaleDef.intervals)
      const fingering =
        scaleDef.name === 'Major' && MAJOR_SCALE_FINGERINGS[appState.selectedRoot]
          ? MAJOR_SCALE_FINGERINGS[appState.selectedRoot]
          : getDefaultFingering(scaleDef.intervals.length)
      const fingers = appState.hand === 'rh' ? fingering.rh : fingering.lh
      return scaleNotes.map((note, i) => ({
        note,
        color: SCALE_DEGREE_COLORS[i % SCALE_DEGREE_COLORS.length],
        label: fingers[i] != null ? String(fingers[i]) : undefined,
      }))
    }
    if (route === 'chords') {
      const rootIdx = noteIndex(appState.selectedRoot)
      return invertedIntervals.map((interval, i) => {
        const absIdx = rootIdx + interval
        const note = noteFromIndex(absIdx)
        const octave = appState.startOctave + Math.floor(absIdx / 12) - Math.floor(rootIdx / 12)
        const label = INTERVAL_LABELS[interval % 12] ?? String(interval)
        return { note, octave, color: INTERVAL_COLORS[label] ?? '#3b82f6', label }
      })
    }
    if (route === 'arpeggios') {
      const rootIdx = noteIndex(appState.selectedRoot)
      return twoOctaveIntervals.map((interval, i) => {
        const absIdx = rootIdx + interval
        const note = noteFromIndex(absIdx)
        const octave = appState.startOctave + Math.floor(absIdx / 12) - Math.floor(rootIdx / 12)
        const label = INTERVAL_LABELS[interval % 12] ?? 'R'
        return { note, octave, color: INTERVAL_COLORS[label] ?? '#3b82f6', label: String(i + 1) }
      })
    }
    return []
  }, [route, appState.selectedRoot, appState.selectedScale, appState.selectedChord, appState.inversion, appState.hand, appState.startOctave])

  useEffect(() => {
    if (route === 'scales') {
      preloadNotes(appState.selectedRoot, [...scaleDef.intervals, 12])
    } else if (route === 'arpeggios') {
      preloadNotes(appState.selectedRoot, twoOctaveIntervals)
    } else {
      preloadNotes(appState.selectedRoot, invertedIntervals)
    }
  }, [route, appState.selectedRoot, appState.selectedScale, appState.selectedChord, appState.inversion])

  const hintText = route === 'scales'
    ? 'Numbers on keys show fingering (1 = thumb, 5 = pinky). Colors show scale degrees.'
    : route === 'chords'
    ? 'Labels on keys show intervals. Tap an inversion to shift the voicing.'
    : 'Numbers show playing order across 2 octaves. Same chord tones repeat in the second octave.'

  const hintLegend = route === 'scales'
    ? SCALE_LEGEND.slice(0, scaleDef.intervals.length)
    : CHORD_LEGEND.slice(0, chordDef.intervals.length)

  const playButtons = route === 'scales' ? (
    <PlayButton label="Play Scale" onPlay={() => playIntervalSequence(appState.selectedRoot, [...scaleDef.intervals, 12])} />
  ) : route === 'chords' ? (
    <PlayButton label="Play Chord" onPlay={() => playChordFromIntervals(appState.selectedRoot, invertedIntervals)} />
  ) : (
    <>
      <PlayButton label="Ascending" onPlay={() => playIntervalSequence(appState.selectedRoot, twoOctaveIntervals, 4, 180)} />
      <PlayButton label="Asc + Desc" onPlay={() => {
        const descIntervals = [...twoOctaveIntervals].reverse()
        return playIntervalSequence(appState.selectedRoot, [...twoOctaveIntervals, ...descIntervals], 4, 180)
      }} />
    </>
  )

  function handleChordFromCircle(quality: string) {
    appState.setSelectedChord(quality)
    setCircleOpen(false)
    setRoute('chords')
  }

  return (
    <Layout
      selectedRoot={appState.selectedRoot}
      onRootChange={appState.setSelectedRoot}
      noteNaming={appState.noteNaming}
      onCycleNaming={appState.cycleNoteNaming}
      activeRoute={route}
      onNavigate={setRoute}
      onCircleToggle={() => setCircleOpen(prev => !prev)}
      startOctave={appState.startOctave}
      onOctaveChange={appState.setStartOctave}
      highlights={highlights}
      hintText={hintText}
      hintLegend={hintLegend}
      playButtons={playButtons}
    >
      {route === 'scales' && (
        <ScalesPage
          selectedScale={appState.selectedScale}
          onScaleChange={appState.setSelectedScale}
          hand={appState.hand}
          onHandChange={appState.setHand}
        />
      )}
      {route === 'chords' && (
        <ChordsPage
          selectedChord={appState.selectedChord}
          onChordChange={appState.setSelectedChord}
          inversion={appState.inversion}
          onInversionChange={appState.setInversion}
        />
      )}
      {route === 'arpeggios' && (
        <ArpeggiosPage
          selectedChord={appState.selectedChord}
          onChordChange={appState.setSelectedChord}
          hand={appState.hand}
          onHandChange={appState.setHand}
        />
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

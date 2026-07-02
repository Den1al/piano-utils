import { useState, useEffect, useCallback } from 'react'
import type { NoteName } from '../data/notes'
import type { NoteNaming } from '../data/notes'

const STORAGE_KEY = 'piano-utils-state'

interface AppState {
  selectedRoot: NoteName
  selectedScale: string
  selectedChord: string
  hand: 'rh' | 'lh'
  inversion: number
  noteNaming: NoteNaming
}

const DEFAULT_STATE: AppState = {
  selectedRoot: 'C',
  selectedScale: 'Major',
  selectedChord: 'Major',
  hand: 'rh',
  inversion: 0,
  noteNaming: 'letters',
}

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_STATE
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setSelectedRoot = useCallback((selectedRoot: NoteName) => {
    setState(prev => ({ ...prev, selectedRoot }))
  }, [])

  const setSelectedScale = useCallback((selectedScale: string) => {
    setState(prev => ({ ...prev, selectedScale }))
  }, [])

  const setSelectedChord = useCallback((selectedChord: string) => {
    setState(prev => ({ ...prev, selectedChord }))
  }, [])

  const setHand = useCallback((hand: 'rh' | 'lh') => {
    setState(prev => ({ ...prev, hand }))
  }, [])

  const setInversion = useCallback((inversion: number) => {
    setState(prev => ({ ...prev, inversion }))
  }, [])

  const setNoteNaming = useCallback((noteNaming: NoteNaming) => {
    setState(prev => ({ ...prev, noteNaming }))
  }, [])

  const cycleNoteNaming = useCallback(() => {
    setState(prev => {
      const order: NoteNaming[] = ['letters', 'solfege', 'both']
      const idx = order.indexOf(prev.noteNaming)
      return { ...prev, noteNaming: order[(idx + 1) % order.length] }
    })
  }, [])

  return {
    ...state,
    setSelectedRoot,
    setSelectedScale,
    setSelectedChord,
    setHand,
    setInversion,
    setNoteNaming,
    cycleNoteNaming,
  }
}

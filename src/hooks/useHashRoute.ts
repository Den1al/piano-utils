import { useState, useEffect, useCallback } from 'react'

const VALID_ROUTES = ['scales', 'circle', 'chords', 'arpeggios'] as const

function getRouteFromHash(): string {
  const hash = window.location.hash.replace('#', '')
  return VALID_ROUTES.includes(hash as typeof VALID_ROUTES[number]) ? hash : 'scales'
}

export function useHashRoute(): [string, (route: string) => void] {
  const [route, setRouteState] = useState(getRouteFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setRouteState(getRouteFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const setRoute = useCallback((newRoute: string) => {
    window.location.hash = newRoute
  }, [])

  return [route, setRoute]
}

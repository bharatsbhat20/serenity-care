// ============================================================================
// DataContext — single source of truth for which backend the app talks to.
//
// The `useDataSource` toggle persists to localStorage and decides whether the
// app reads from the in-memory mock service or a live API/database service.
// Components consume data through `useData()` and never import a service
// directly, so the switch is completely transparent to the rest of the app.
// ============================================================================
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mockService } from './mockService.js'
import { apiService } from './apiService.js'

const DataContext = createContext(null)

const STORAGE_KEY = 'serenity:dataSource'

export function DataProvider({ children }) {
  const [useLiveDatabase, setUseLiveDatabase] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'live'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, useLiveDatabase ? 'live' : 'mock')
    } catch {
      /* ignore */
    }
  }, [useLiveDatabase])

  const service = useLiveDatabase ? apiService : mockService

  const value = useMemo(
    () => ({
      service,
      useLiveDatabase,
      setUseLiveDatabase,
      apiConfigured: apiService.configured,
      source: service.source,
    }),
    [service, useLiveDatabase]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}

// Convenience hook: run an async service call, with loading + error + refetch.
import { useCallback, useRef } from 'react'

export function useAsync(fetcher, deps = []) {
  const { service } = useData()
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    Promise.resolve(fetcherRef.current(service))
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, ...deps])

  useEffect(() => run(), [run])

  return { ...state, refetch: run }
}

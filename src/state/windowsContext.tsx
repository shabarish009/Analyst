import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type OpenWindow = { id: string; title: string }

type WindowsContextType = {
  windows: OpenWindow[]
  register: (win: OpenWindow) => void
  unregister: (id: string) => void
}

const WindowsContext = createContext<WindowsContextType | null>(null)

export const WindowsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const register = useCallback((w: OpenWindow) => {
    setWindows((prev) => (prev.find((p) => p.id === w.id) ? prev : [...prev, w]))
  }, [])
  const unregister = useCallback((id: string) => {
    setWindows((prev) => prev.filter((p) => p.id !== id))
  }, [])
  const value = useMemo(() => ({ windows, register, unregister }), [windows, register, unregister])
  return <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
}

export const useWindows = () => {
  const ctx = useContext(WindowsContext)
  if (!ctx) throw new Error('useWindows must be used within WindowsProvider')
  return ctx
}


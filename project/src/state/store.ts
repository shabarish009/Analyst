import { create } from 'zustand'

export type OpenWindow = { id: string; title: string }

type State = {
  windows: OpenWindow[]
  startOpen: boolean
  dbPath: string | null
  register: (w: OpenWindow) => void
  unregister: (id: string) => void
  toggleStart: () => void
  setDbPath: (p: string | null) => void
}

export const useShellStore = create<State>((set) => ({
  windows: [],
  startOpen: false,
  dbPath: null,
  register: (w) => set((s) => (s.windows.find((p) => p.id === w.id) ? s : { ...s, windows: [...s.windows, w] })),
  unregister: (id) => set((s) => ({ ...s, windows: s.windows.filter((p) => p.id !== id) })),
  toggleStart: () => set((s) => ({ ...s, startOpen: !s.startOpen })),
  setDbPath: (p) => set((s) => ({ ...s, dbPath: p })),
}))


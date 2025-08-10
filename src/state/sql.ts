import { create } from 'zustand'

export type SQLState = {
  text: string
  setText: (t: string) => void
}

export const useSQLState = create<SQLState>((set) => ({
  text: '',
  setText: (t) => set({ text: t }),
}))


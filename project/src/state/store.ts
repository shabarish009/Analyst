import { create } from 'zustand'

export type OpenWindow = { id: string; title: string }

export type SessionData = { cols: string[]; rows: any[][] }

export type TestPlan = { id?: string; steps: Array<{ type: string; sql?: string }> } | null
export type TestResult = { ok: boolean; message: string } | null

export type Role = 'admin' | 'editor' | 'viewer'
export type User = { id: string; name: string; role: Role }
export type AuditEvent = { ts: number; actor: string; action: string; target?: string; ok: boolean; message?: string }

type State = {
  windows: OpenWindow[]
  startOpen: boolean
  dbPath: string | null
  sessionSources: Record<string, SessionData>
  currentUser: User
  auditLog: AuditEvent[]
  testPlan: TestPlan
  testPlanExecuteNonce: number
  testResult: TestResult
  register: (w: OpenWindow) => void
  unregister: (id: string) => void
  toggleStart: () => void
  setDbPath: (p: string | null) => void
  setCurrentUser: (u: User) => void
  appendAudit: (e: AuditEvent) => void
  publishSession: (name: string, data: SessionData) => void
  removeSession: (name: string) => void
  setTestPlan: (p: TestPlan) => void
  triggerTestPlanExecution: () => void
  setTestResult: (r: TestResult) => void
}

export const useShellStore = create<State>((set) => ({
  windows: [],
  startOpen: false,
  dbPath: null,
  sessionSources: {},
  currentUser: { id: 'u1', name: 'Admin', role: 'admin' },
  auditLog: [],
  testPlan: null,
  testPlanExecuteNonce: 0,
  testResult: null,
  register: (w) => set((s) => (s.windows.find((p) => p.id === w.id) ? s : { ...s, windows: [...s.windows, w] })),
  unregister: (id) => set((s) => ({ ...s, windows: s.windows.filter((p) => p.id !== id) })),
  toggleStart: () => set((s) => ({ ...s, startOpen: !s.startOpen })),
  setDbPath: (p) => set((s) => ({ ...s, dbPath: p })),
  setCurrentUser: (u) => set((s) => ({ ...s, currentUser: u })),
  appendAudit: (e) => set((s) => ({ ...s, auditLog: [...s.auditLog, e] })),
  publishSession: (name, data) => set((s) => ({ ...s, sessionSources: { ...s.sessionSources, [name]: data } })),
  removeSession: (name) => set((s) => { const { [name]: _, ...rest } = s.sessionSources; return { ...s, sessionSources: rest } }),
  setTestPlan: (p) => set((s) => ({ ...s, testPlan: p })),
  triggerTestPlanExecution: () => set((s) => ({ ...s, testPlanExecuteNonce: s.testPlanExecuteNonce + 1 })),
  setTestResult: (r) => set((s) => ({ ...s, testResult: r })),
}))


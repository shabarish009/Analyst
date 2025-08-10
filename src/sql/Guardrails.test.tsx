import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SQLAnalyst } from './SQLAnalyst'
import { useShellStore } from '../state/store'

vi.mock('../lib/dbBridge', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
  executeQuery: vi.fn().mockResolvedValue({ cols: ['id'], rows: [[1]] }),
  getSchema: vi.fn().mockResolvedValue({}),
}))

vi.mock('../lib/bridge', () => ({
  generateSQL: vi.fn().mockResolvedValue(JSON.stringify({ sql: 'SELECT 1' })),
}))

describe('Guardrails RBAC', () => {
  it('blocks viewer from running queries and logs audit', async () => {
    const user = userEvent.setup()
    useShellStore.getState().setCurrentUser({ id: 'u2', name: 'View', role: 'viewer' })
    render(<SQLAnalyst />)
    await user.click(screen.getByRole('button', { name: /run/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/permission denied/i)
    const audit = useShellStore.getState().auditLog
    expect(audit[audit.length - 1]).toMatchObject({ action: 'sql/run', ok: false })
  })

  it('allows admin to run queries and logs audit ok', async () => {
    const user = userEvent.setup()
    useShellStore.getState().setCurrentUser({ id: 'u1', name: 'Admin', role: 'admin' })
    render(<SQLAnalyst />)
    await user.click(screen.getByRole('button', { name: /run/i }))
    expect(await screen.findByRole('table', { name: /results grid/i })).toBeInTheDocument()
    const audit = useShellStore.getState().auditLog
    expect(audit[audit.length - 1]).toMatchObject({ action: 'sql/run', ok: true })
  })
})


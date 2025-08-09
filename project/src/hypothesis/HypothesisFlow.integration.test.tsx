import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { HypothesisTester } from './HypothesisTester'
import { SQLAnalyst } from '../sql/SQLAnalyst'

vi.mock('../lib/hypoBridge', () => ({
  planHypothesis: vi.fn().mockResolvedValue({ plan: { steps: [{ type: 'sql', sql: 'SELECT 1 AS one' }] } })
}))

vi.mock('../lib/dbBridge', async () => {
  const mod = await vi.importActual('../lib/dbBridge') as any
  return {
    ...mod,
    executeQuery: vi.fn().mockResolvedValue({ cols: ['one'], rows: [[1]] }),
  }
})

describe('Hypothesis reactive flow', () => {
  it('plans in HypothesisTester, executes in SQLAnalyst, and returns verdict', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <HypothesisTester />
        <SQLAnalyst />
      </div>
    )

    await user.type(screen.getByLabelText(/^hypothesis$/i), 'Check health')
    await user.click(screen.getByRole('button', { name: /plan hypothesis/i }))
    // Wait for plan panel to render (it shows PRE aria-label="Plan")
    await screen.findByLabelText(/^plan$/i)

    await user.click(screen.getByRole('button', { name: /execute plan/i }))

    const verdict = await screen.findByRole('status', { name: /result/i })
    expect(verdict).toHaveTextContent(/Executed plan SQL \(1 rows\)/i)
  })
})


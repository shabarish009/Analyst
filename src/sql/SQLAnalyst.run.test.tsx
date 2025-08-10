import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SQLAnalyst } from './SQLAnalyst'
import { useShellStore } from '../state/store'

vi.mock('../lib/dbBridge', () => ({
  connectDb: vi.fn().mockResolvedValue(undefined),
  executeQuery: vi.fn().mockResolvedValue({ cols: ['id'], rows: [[1], [2]] }),
  getSchema: vi.fn().mockResolvedValue({}),
}))

vi.mock('../lib/bridge', () => ({
  generateSQL: vi.fn().mockResolvedValue(JSON.stringify({ sql: 'SELECT * FROM people;' })),
}))

describe('<SQLAnalyst> run integration', () => {
  it('shows results grid after run', async () => {
    const user = userEvent.setup()
    useShellStore.getState().setDbPath('C:/tmp/test.sqlite')
    render(<SQLAnalyst />)
    // generate SQL
    await user.click(screen.getByRole('button', { name: /generate sql/i }))
    // run query
    await user.click(screen.getByRole('button', { name: /run/i }))
    expect(await screen.findByRole('table', { name: /results grid/i })).toBeInTheDocument()
  })
})


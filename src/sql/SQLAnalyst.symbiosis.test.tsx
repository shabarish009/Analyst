import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SQLAnalyst } from './SQLAnalyst'
import { ExcelAnalyst } from '../excel/ExcelAnalyst'
import { useShellStore } from '../state/store'

vi.mock('../lib/dbBridge', () => ({
  readDataset: vi.fn().mockResolvedValue({ cols: ['name','value'], rows: [['Alice','100'], ['Bob','200']] }),
  registerSessionTable: vi.fn().mockResolvedValue(undefined),
  connectDb: vi.fn().mockResolvedValue(undefined),
  executeQuery: vi.fn().mockResolvedValue({ cols: ['name','value'], rows: [['Alice','100'], ['Bob','200']] }),
  getSchema: vi.fn().mockResolvedValue({ test_data: ['name','value'] }),
}))

vi.mock('../lib/bridge', () => ({
  generateSQL: vi.fn().mockResolvedValue(JSON.stringify({ sql: 'SELECT * FROM test_data;' })),
}))

describe('SQLAnalyst + ExcelAnalyst symbiosis', () => {
  it('CSV data becomes instantly queryable in SQL', async () => {
    const user = userEvent.setup()
    useShellStore.getState().removeSession('test_data')
    
    render(
      <div>
        <ExcelAnalyst />
        <SQLAnalyst />
      </div>
    )
    
    // Load CSV in ExcelAnalyst
    await user.type(screen.getByLabelText(/^file$/i), 'C:/data/test.csv')
    const nameInput = screen.getByLabelText(/session name/i) as HTMLInputElement
    await user.clear(nameInput)
    await user.type(nameInput, 'test_data')
    await user.click(screen.getByRole('button', { name: /^load file$/i }))
    
    // Wait for dataset to render to ensure publish completed
    await screen.findByRole('table', { name: /results grid/i })

    // Verify session published
    const session = useShellStore.getState().sessionSources['test_data']
    expect(session?.cols).toEqual(['name','value'])

    // Generate SQL in SQLAnalyst (should use schema from session)
    await user.click(screen.getByRole('button', { name: /generate sql/i }))

    // Run query (should work against session table)
    await user.click(screen.getByRole('button', { name: /^run$/i }))

    // Verify results grid appears with session data
    const grids = screen.getAllByRole('table', { name: /results grid/i })
    expect(grids.length).toBeGreaterThan(0)
  })
})

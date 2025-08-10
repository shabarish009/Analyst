import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ExcelAnalyst } from './ExcelAnalyst'

vi.mock('../lib/dbBridge', () => ({
  readDataset: vi.fn().mockResolvedValue({ cols: ['a','b'], rows: [['1','2'], ['3','4']] }),
  registerSessionTable: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../lib/bridge', () => ({
  analyzeData: vi.fn().mockResolvedValue(JSON.stringify({ insights: 'Rows=2; a: count=2, mean=2.00' }))
}))

describe('<ExcelAnalyst> analyze', () => {
  it('shows AI insights after Analyze', async () => {
    const user = userEvent.setup()
    render(<ExcelAnalyst />)
    // Load dataset
    await user.type(screen.getByLabelText(/^file$/i), 'C:/data/file.csv')
    await user.click(screen.getByRole('button', { name: /^load file$/i }))
    // Analyze
    await user.click(screen.getByRole('button', { name: /analyze with ai/i }))
    expect(await screen.findByRole('region', { name: /insights/i })).toHaveTextContent(/rows=2/i)
  })
})


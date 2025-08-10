import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ExcelAnalyst } from './ExcelAnalyst'
import { useShellStore } from '../state/store'

vi.mock('../lib/dbBridge', () => ({
  readDataset: vi.fn().mockResolvedValue({ cols: ['a','b'], rows: [['1','2'], ['3','4']] }),
  registerSessionTable: vi.fn().mockResolvedValue(undefined),
}))

describe('<ExcelAnalyst> integration', () => {
  it('loads file, publishes session, and shows grid', async () => {
    const user = userEvent.setup()
    useShellStore.getState().removeSession('session_data')
    render(<ExcelAnalyst />)
    await user.type(screen.getByLabelText(/^file$/i), 'C:/data/file.csv')
    await user.click(screen.getByRole('button', { name: /^load file$/i }))
    // sessionSources should contain our dataset
    const session = useShellStore.getState().sessionSources['session_data']
    expect(session?.cols).toHaveLength(2)
    expect(await screen.findByRole('table', { name: /results grid/i })).toBeInTheDocument()
  })
})


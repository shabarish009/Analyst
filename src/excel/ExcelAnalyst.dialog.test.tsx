import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ExcelAnalyst } from './ExcelAnalyst'

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: vi.fn().mockResolvedValue('C:/data/from-dialog.csv')
}))

describe('<ExcelAnalyst> dialog', () => {
  it('uses native open dialog to pick file and populates path input', async () => {
    const user = userEvent.setup()
    render(<ExcelAnalyst />)
    await user.click(screen.getByRole('button', { name: /open file/i }))
    const input = screen.getByLabelText(/^file$/i) as HTMLInputElement
    expect(input.value).toMatch(/from-dialog\.csv$/)
  })
})


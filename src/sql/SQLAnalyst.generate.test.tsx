import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SQLAnalyst } from './SQLAnalyst'
import { useSQLState } from '../state/sql'

vi.mock('../lib/bridge', () => ({
  generateSQL: vi.fn().mockResolvedValue(JSON.stringify({ sql: 'SELECT * FROM tbl_placeholder;' }))
}))

describe('<SQLAnalyst> generate integration', () => {
  it('updates editor with returned SQL', async () => {
    const user = userEvent.setup()
    useSQLState.getState().setText('')
    render(<SQLAnalyst />)
    await user.click(screen.getByRole('button', { name: /generate sql/i }))
    const cm = screen.getByRole('textbox')
    expect(cm).toHaveTextContent(/select\s*\*\s*from\s*tbl_placeholder/i)
  })
})


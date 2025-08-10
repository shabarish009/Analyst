import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { SQLAnalyst } from './SQLAnalyst'
import { useSQLState } from '../state/sql'

function setTextDirect(val: string) {
  useSQLState.getState().setText(val)
}

describe('<SQLAnalyst> integration', () => {
  it('reflects Zustand state in CodeMirror and updates on edit', async () => {
    const user = userEvent.setup()
    setTextDirect('SELECT 1;')
    render(<SQLAnalyst />)

    const cm = screen.getByRole('textbox')
    expect(cm).toHaveTextContent(/select\s*1;/i)

    await user.type(cm, ' -- comment')
    expect(useSQLState.getState().text.toLowerCase()).toContain('comment')
  })
})


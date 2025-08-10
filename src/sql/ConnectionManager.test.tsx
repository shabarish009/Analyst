import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ConnectionManager } from './ConnectionManager'
import { useShellStore } from '../state/store'

describe('<ConnectionManager>', () => {
  it('updates and displays db path', async () => {
    const user = userEvent.setup()
    useShellStore.getState().setDbPath(null)
    render(<ConnectionManager />)
    const input = screen.getByLabelText(/sqlite file path/i)
    await user.type(input, 'C:/tmp/test.sqlite')
    expect(screen.getByRole('status')).toHaveTextContent('Connected: C:/tmp/test.sqlite')
  })
})


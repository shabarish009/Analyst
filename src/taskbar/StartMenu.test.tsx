import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Taskbar } from './Taskbar'

const App = () => (
  <Taskbar />
)

describe('<StartMenu>', () => {
  it('toggles open/close from Start Button', async () => {
    const user = userEvent.setup()
    render(<App />)
    const startBtn = screen.getByRole('button', { name: 'Start' })

    // closed initially
    expect(screen.queryByRole('menu', { name: 'Start Menu' })).toBeNull()

    // open
    await user.click(startBtn)
    expect(screen.getByRole('menu', { name: 'Start Menu' })).toBeInTheDocument()

    // close
    await user.click(startBtn)
    expect(screen.queryByRole('menu', { name: 'Start Menu' })).toBeNull()
  })
})


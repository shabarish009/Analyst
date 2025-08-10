import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskbarButton } from './TaskbarButton'

describe('<TaskbarButton>', () => {
  it('renders and toggles aria-pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { rerender } = render(<TaskbarButton label="App" active onClick={onClick} />)

    const btn = screen.getByRole('button', { name: /taskbar button: app/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')

    rerender(<TaskbarButton label="App" active={false} onClick={onClick} />)
    expect(btn).toHaveAttribute('aria-pressed', 'false')

    await user.click(btn)
    expect(onClick).toHaveBeenCalled()
  })
})


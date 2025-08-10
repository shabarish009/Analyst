import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Window } from '../ui/Window'
import { Taskbar } from './Taskbar'

function App() {
  return (
    <>
      <Window id="win-1" title="My App">
        Body
      </Window>
      <Taskbar />
    </>
  )
}

describe('Taskbar integration', () => {
  it('shows a TaskbarButton when a Window is rendered', () => {
    render(<App />)
    expect(screen.getByRole('toolbar', { name: 'Taskbar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /taskbar button: my app/i })).toBeInTheDocument()
  })
})


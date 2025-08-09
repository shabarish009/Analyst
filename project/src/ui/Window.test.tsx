import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Window } from './Window'
import { WindowsProvider } from '../state/windowsContext'

describe('<Window>', () => {
  it('renders with title and content', () => {
    render(
      <WindowsProvider>
        <Window id="w1" title="My Window">
          <div>Body</div>
        </Window>
      </WindowsProvider>
    )
    expect(screen.getByRole('dialog', { name: 'My Window' })).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})


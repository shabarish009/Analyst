import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Whiteboard } from './Whiteboard'
import { registerHello } from '../plugins/hello/HelloPlugin'
import { collabEngine } from '../collab/engine'

registerHello()

describe('<Whiteboard> plugin rendering', () => {
  it('renders a HelloWidget registered via SDK when an item has type hello', async () => {
    render(<Whiteboard roomId="room2" />)
    // Inject a plugin item
    collabEngine.addItem('room2', { id: 'p1', type: 'hello', x: 0, y: 0, w: 120, h: 80 })

    const hello = await screen.findByRole('group', { name: /hellowidget/i })
    expect(hello).toBeInTheDocument()
  })
})


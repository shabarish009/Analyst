import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Whiteboard } from './Whiteboard'

// We use the in-memory collab engine; to simulate two users, render two components for the same room

describe('<Whiteboard> collaboration', () => {
  it('syncs items across two instances', async () => {
    const user = userEvent.setup()
    render(<div><Whiteboard roomId="room1" /><Whiteboard roomId="room1" /></div>)

    // add a bar chart from one instance
    const addButtons = screen.getAllByRole('button', { name: /\+ bar/i })
    await user.click(addButtons[0])

    // both instances should render a BarChart svg
    const charts = await screen.findAllByRole('img', { name: /barchart/i })
    expect(charts.length).toBeGreaterThanOrEqual(2)
  })
})


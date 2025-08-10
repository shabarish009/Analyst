import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DashboardCreator } from './DashboardCreator'
import { useShellStore } from '../state/store'

vi.mock('../lib/bridge', () => ({
  generateDashboardInsights: vi.fn().mockResolvedValue(JSON.stringify({ insights: 'Dashboard with 2 widgets across sources: ds1.' }))
}))

describe('<DashboardCreator>', () => {
  it('adds widgets and generates dashboard insights', async () => {
    const user = userEvent.setup()
    useShellStore.getState().publishSession('ds1', { cols: ['x','y'], rows: [['A',1],['B',2]] })
    render(<DashboardCreator />)

    await user.click(screen.getByRole('button', { name: /add bar chart/i }))
    await user.click(screen.getByRole('button', { name: /add kpi/i }))
    await user.click(screen.getByRole('button', { name: /generate insights/i }))

    expect(await screen.findByRole('region', { name: /dashboard insights/i })).toHaveTextContent(/dashboard with/i)
  })
})


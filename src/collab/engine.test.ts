import { describe, it, expect } from 'vitest'
import { collabEngine } from './engine'

describe('Collaboration Engine', () => {
  it('broadcasts join and updates to multiple subscribers', () => {
    const room = 'r1'
    const seenA: any[] = []
    const seenB: any[] = []
    const unsubA = collabEngine.join(room, (s) => seenA.push(s))
    const unsubB = collabEngine.join(room, (s) => seenB.push(s))

    collabEngine.addItem(room, { id: 'w1', type: 'kpi', x: 0, y: 0, w: 100, h: 80 })
    collabEngine.updateItem(room, { id: 'w1', x: 10 })

    expect(seenA.length).toBeGreaterThan(1)
    expect(seenB.length).toBeGreaterThan(1)
    expect(seenA[seenA.length - 1].items['w1'].x).toBe(10)
    expect(seenB[seenB.length - 1].items['w1'].version).toBe(2)

    unsubA(); unsubB()
  })
})


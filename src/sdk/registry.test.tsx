import { describe, it, expect } from 'vitest'
import { registerWidget, getWidgetRenderer, listRegistered } from './registry'
import React from 'react'

const W: React.FC<{ data: any }> = () => <div>W</div>

describe('SDK widget registry', () => {
  it('registers and retrieves widgets', () => {
    registerWidget('x', W as any)
    const R = getWidgetRenderer('x')
    expect(R).toBeTruthy()
    expect(listRegistered()).toContain('x')
  })
})


import { describe, it, expect, vi } from 'vitest'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue('Hello from ai_core')
}))

import { pyHello } from './bridge'

describe('bridge.pyHello', () => {
  it('invokes tauri command and resolves', async () => {
    await expect(pyHello()).resolves.toMatch(/Hello/)
  })
})


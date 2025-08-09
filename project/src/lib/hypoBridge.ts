import { invoke } from '@tauri-apps/api/core'

export async function planHypothesis(prompt: string): Promise<{ plan: any }>{
  const raw = await invoke<string>('plan_hypothesis', { prompt })
  return JSON.parse(raw)
}


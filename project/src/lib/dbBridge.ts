import { invoke } from '@tauri-apps/api/core'

export async function connectDb(path: string): Promise<void> {
  await invoke('connect_db', { path })
}

export async function executeQuery(sql: string): Promise<{ cols?: string[]; rows?: any[]; affected?: number }>{
  const raw = await invoke<string>('execute_query', { sql })
  return JSON.parse(raw)
}

export async function getSchema(): Promise<Record<string, string[]>> {
  const raw = await invoke<string>('get_schema')
  return JSON.parse(raw)
}


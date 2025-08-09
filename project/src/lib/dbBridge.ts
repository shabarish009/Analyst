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

export async function readDataset(path: string): Promise<{ cols: string[]; rows: any[][] }>{
  const raw = await invoke<string>('read_dataset', { path })
  return JSON.parse(raw)
}

export async function registerSessionTable(name: string, cols: string[], rows: any[][]): Promise<void> {
  await invoke('register_session_table', { name, cols, rows })
}


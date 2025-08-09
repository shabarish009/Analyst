import { invoke } from '@tauri-apps/api/core'

export async function pyHello(): Promise<string> {
  return invoke<string>('py_hello')
}

export async function generateSQL(prompt: string, schema?: unknown): Promise<string> {
  const schemaStr = schema ? JSON.stringify(schema) : undefined
  return invoke<string>('generate_sql', { prompt, schema: schemaStr })
}


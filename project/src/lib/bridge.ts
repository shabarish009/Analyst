import { invoke } from '@tauri-apps/api/core'

export async function pyHello(): Promise<string> {
  return invoke<string>('py_hello')
}

export async function generateSQL(prompt: string, schema?: unknown): Promise<string> {
  const schemaStr = schema ? JSON.stringify(schema) : undefined
  return invoke<string>('generate_sql', { prompt, schema: schemaStr })
}

export async function analyzeData(payload: { name: string; cols: string[]; sample: any[][] }): Promise<string> {
  return invoke<string>('analyze_data', { payload: JSON.stringify(payload) })
}

export async function generateDashboardInsights(payload: { widgets: any[]; sources: Record<string, any> }): Promise<string> {
  return invoke<string>('generate_dashboard_insights', { payload: JSON.stringify(payload) })
}


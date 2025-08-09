import { invoke } from '@tauri-apps/api/core'

export async function pyHello(): Promise<string> {
  return invoke<string>('py_hello')
}


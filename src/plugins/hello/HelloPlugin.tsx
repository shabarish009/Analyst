import React from 'react'
import { registerWidget } from '../../sdk/registry'

export const HelloWidget: React.FC<{ data: { cols: string[]; rows: any[][] } }> = ({ data }) => {
  return <div role="group" aria-label="HelloWidget">Hello {data.rows[0]?.[0] ?? 'World'}</div>
}

export function registerHello() {
  registerWidget('hello', HelloWidget)
}


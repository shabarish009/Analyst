import React from 'react'

export type WidgetRenderer = React.FC<{ data: { cols: string[]; rows: any[][] } }>

const registry = new Map<string, WidgetRenderer>()

export function registerWidget(type: string, renderer: WidgetRenderer) {
  registry.set(type, renderer)
}

export function getWidgetRenderer(type: string): WidgetRenderer | undefined {
  return registry.get(type)
}

export function listRegistered(): string[] {
  return Array.from(registry.keys())
}


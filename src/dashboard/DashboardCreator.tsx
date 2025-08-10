import React, { useState, useCallback } from 'react'
import { useShellStore, SessionData } from '../state/store'
import { BarChart } from './widgets/BarChart'
import { LineChart } from './widgets/LineChart'
import { KPIStat } from './widgets/KPIStat'

export type Widget = {
  id: string
  type: 'bar' | 'line' | 'kpi'
  x: number
  y: number
  w: number
  h: number
  dataSource?: string
  config?: any
}

export const DashboardCreator: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [dragState, setDragState] = useState<{ id: string; startX: number; startY: number } | null>(null)
  const [insights, setInsights] = useState<string | null>(null)
  const sessionSources = useShellStore((s) => s.sessionSources)

  const addWidget = useCallback((type: 'bar' | 'line' | 'kpi') => {
    const id = `widget-${Date.now()}`
    const newWidget: Widget = {
      id,
      type,
      x: Math.random() * 400,
      y: Math.random() * 300,
      w: 200,
      h: 150,
    }
    setWidgets(prev => [...prev, newWidget])
  }, [])

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id))
    if (selectedWidget === id) setSelectedWidget(null)
  }, [selectedWidget])

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setSelectedWidget(id)
    setDragState({ id, startX: e.clientX, startY: e.clientY })
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    updateWidget(dragState.id, { 
      x: Math.max(0, widgets.find(w => w.id === dragState.id)!.x + dx),
      y: Math.max(0, widgets.find(w => w.id === dragState.id)!.y + dy)
    })
    setDragState({ ...dragState, startX: e.clientX, startY: e.clientY })
  }, [dragState, widgets, updateWidget])

  const onMouseUp = useCallback(() => {
    setDragState(null)
  }, [])

  const generateInsights = async () => {
    try {
      const payload = { widgets, sources: sessionSources }
      const { generateDashboardInsights } = await import('../lib/bridge')
      const raw = await generateDashboardInsights(payload)
      const j = JSON.parse(raw)
      setInsights(j?.insights || 'No insights available')
    } catch (e: any) {
      setInsights(`Error: ${e.message}`)
    }
  }

  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget === widget.id
    const style = {
      position: 'absolute' as const,
      left: widget.x,
      top: widget.y,
      width: widget.w,
      height: widget.h,
      border: isSelected ? '2px solid #0078d4' : '1px solid #808080',
      background: '#ece9d8',
      cursor: 'move',
    }

    const data = widget.dataSource && sessionSources[widget.dataSource] 
      ? sessionSources[widget.dataSource] 
      : { cols: ['x', 'y'], rows: [['A', 10], ['B', 20], ['C', 15]] }

    return (
      <div
        key={widget.id}
        style={style}
        onMouseDown={(e) => onMouseDown(e, widget.id)}
        onClick={() => setSelectedWidget(widget.id)}
      >
        {widget.type === 'bar' && <BarChart data={data} />}
        {widget.type === 'line' && <LineChart data={data} />}
        {widget.type === 'kpi' && <KPIStat data={data} />}
        {isSelected && (
          <button
            style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 12 }}
            onClick={(e) => { e.stopPropagation(); deleteWidget(widget.id) }}
          >
            ×
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: 500, gap: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => addWidget('bar')} aria-label="Add Bar Chart">+ Bar</button>
        <button onClick={() => addWidget('line')} aria-label="Add Line Chart">+ Line</button>
        <button onClick={() => addWidget('kpi')} aria-label="Add KPI">+ KPI</button>
        <button onClick={generateInsights} aria-label="Generate Insights">Generate Insights</button>
        <span>Sources: {Object.keys(sessionSources).join(', ') || 'None'}</span>
      </div>
      
      <div 
        style={{ position: 'relative', border: '1px solid #808080', background: '#f0f0f0', overflow: 'hidden' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {widgets.map(renderWidget)}
      </div>

      {selectedWidget && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>Data Source:</label>
          <select 
            value={widgets.find(w => w.id === selectedWidget)?.dataSource || ''}
            onChange={(e) => updateWidget(selectedWidget, { dataSource: e.target.value || undefined })}
          >
            <option value="">Default</option>
            {Object.keys(sessionSources).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      )}

      {insights && (
        <div role="region" aria-label="Dashboard Insights" style={{ background: '#ffffe1', border: '1px solid #808080', padding: 8 }}>
          {insights}
        </div>
      )}
    </div>
  )
}

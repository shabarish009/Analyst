import React, { useEffect, useState, useCallback } from 'react'
import { collabEngine, type WBItem } from '../collab/engine'
import { useShellStore } from '../state/store'
import { BarChart } from '../dashboard/widgets/BarChart'
import { LineChart } from '../dashboard/widgets/LineChart'
import { KPIStat } from '../dashboard/widgets/KPIStat'
import { getWidgetRenderer } from '../sdk/registry'

type Props = { roomId: string }

export const Whiteboard: React.FC<Props> = ({ roomId }) => {
  const sessionSources = useShellStore((s) => s.sessionSources)
  const [items, setItems] = useState<Record<string, WBItem>>({})
  const [drag, setDrag] = useState<{ id: string; sx: number; sy: number } | null>(null)

  useEffect(() => {
    return collabEngine.join(roomId, (s) => setItems(s.items))
  }, [roomId])

  const add = (type: WBItem['type']) => {
    const id = 'wb-' + Math.random().toString(36).slice(2)
    collabEngine.addItem(roomId, { id, type, x: 20, y: 20, w: 200, h: 140 })
  }

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setDrag({ id, sx: e.clientX, sy: e.clientY })
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag) return
    const cur = items[drag.id]
    if (!cur) return
    const nx = Math.max(0, cur.x + (e.clientX - drag.sx))
    const ny = Math.max(0, cur.y + (e.clientY - drag.sy))
    collabEngine.updateItem(roomId, { id: drag.id, x: nx, y: ny })
    setDrag({ id: drag.id, sx: e.clientX, sy: e.clientY })
  }, [drag, items, roomId])

  const onMouseUp = useCallback(() => setDrag(null), [])

  const render = (it: WBItem) => {
    const data = it.dataSource && sessionSources[it.dataSource] ? sessionSources[it.dataSource] : { cols: ['x','y'], rows: [['A',10],['B',20]] }
    const Plugin = getWidgetRenderer(it.type)
    return (
      <div key={it.id} style={{ position: 'absolute', left: it.x, top: it.y, width: it.w, height: it.h }} onMouseDown={(e) => onMouseDown(e, it.id)}>
        {Plugin ? <Plugin data={data} /> : (
          <>
            {it.type === 'bar' && <BarChart data={data} />}
            {it.type === 'line' && <LineChart data={data} />}
            {it.type === 'kpi' && <KPIStat data={data} />}
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: 400, border: '1px solid #808080' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => add('bar')}>+ Bar</button>
        <button onClick={() => add('line')}>+ Line</button>
        <button onClick={() => add('kpi')}>+ KPI</button>
      </div>
      <div style={{ position: 'relative', background: '#f0f0f0' }} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        {Object.values(items).map(render)}
      </div>
    </div>
  )
}


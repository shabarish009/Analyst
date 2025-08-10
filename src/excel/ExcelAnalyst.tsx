import React, { useState } from 'react'
import { readDataset, registerSessionTable } from '../lib/dbBridge'
import { ResultsGrid } from '../sql/ResultsGrid'
import { useShellStore } from '../state/store'
import { open } from '@tauri-apps/plugin-dialog'

export const ExcelAnalyst: React.FC = () => {
  const [data, setData] = useState<{ cols: string[]; rows: any[][] } | null>(null)
  const [name, setName] = useState('session_data')
  const [path, setPath] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<string | null>(null)
  const publish = useShellStore((s) => s.publishSession)

  const onBrowse = async () => {
    setError(null)
    const file = await open({ multiple: false, filters: [{ name: 'Data', extensions: ['csv', 'xlsx', 'xlsm'] }] })
    if (typeof file === 'string') setPath(file)
  }

  const onLoad = async () => {
    setError(null)
    setInsights(null)
    try {
      const ds = await readDataset(path)
      setData(ds)
      publish(name, ds)
      await registerSessionTable(name, ds.cols, ds.rows)
    } catch (e: any) {
      setError(e.message || String(e))
    }
  }

  const onAnalyze = async () => {
    if (!data) return
    setError(null)
    setInsights(null)
    try {
      const { analyzeData } = await import('../lib/bridge')
      const raw = await analyzeData({ name, cols: data.cols, sample: data.rows.slice(0, 100) })
      const j = JSON.parse(raw)
      setInsights(j?.insights || 'No insights')
    } catch (e: any) {
      setError(e.message || String(e))
    }
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label htmlFor="file">File</label>
        <input id="file" value={path} onChange={(e) => setPath(e.target.value)} placeholder="C:\\data\\file.csv" />
        <button onClick={onBrowse} aria-label="Open File...">Open File…</button>
        <label htmlFor="name">Session Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={onLoad} aria-label="Load File">Load</button>
        <button onClick={onAnalyze} aria-label="Analyze with AI" disabled={!data}>Analyze with AI</button>
      </div>
      {error && <div role="alert" style={{ color: 'crimson' }}>{error}</div>}
      {data && <ResultsGrid cols={data.cols} rows={data.rows} />}
      {insights && <div role="region" aria-label="Insights" style={{ background: '#ffffe1', border: '1px solid #808080', padding: 8 }}>{insights}</div>}
    </div>
  )
}


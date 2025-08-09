import React, { useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { EditorView } from '@codemirror/view'
import { useSQLState } from '../state/sql'
import { generateSQL } from '../lib/bridge'
import { useShellStore } from '../state/store'
import { connectDb, executeQuery, getSchema } from '../lib/dbBridge'
import { ResultsGrid } from './ResultsGrid'

const lunaTheme = EditorView.theme({
  '&': { backgroundColor: '#ece9d8' },
  '.cm-content': { fontFamily: 'Consolas, "Courier New", monospace', fontSize: '13px' },
  '.cm-gutters': { backgroundColor: '#d4d0c8', color: '#444', borderRight: '1px solid #808080' },
  '.cm-activeLine': { backgroundColor: '#cfe8ff' },
  '.cm-selectionMatch': { backgroundColor: '#bcdcff' },
})

export const SQLAnalyst: React.FC = () => {
  const text = useSQLState((s) => s.text)
  const setText = useSQLState((s) => s.setText)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const extensions = useMemo(() => [sql(), lunaTheme], [])

  const dbPath = useShellStore((s) => s.dbPath)
  const [results, setResults] = useState<{ cols: string[]; rows: any[] } | null>(null)

  const onGenerate = async () => {
    setLoading(true); setError(null)
    try {
      let schema: Record<string, unknown> = {}
      if (dbPath) {
        await connectDb(dbPath)
        schema = await getSchema().catch(() => ({}))
      }
      const raw = await generateSQL(text, schema)
      const parsed = JSON.parse(raw)
      if (typeof parsed?.sql === 'string') setText(parsed.sql)
      else throw new Error('Invalid response')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const onRun = async () => {
    if (!dbPath) { setError('No database selected'); return }
    setLoading(true); setError(null)
    try {
      await connectDb(dbPath)
      const out = await executeQuery(text)
      if (out.cols && out.rows) setResults({ cols: out.cols, rows: out.rows })
      else setResults(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <CodeMirror
        value={text}
        height="300px"
        extensions={extensions}
        onChange={(val) => setText(val)}
      />
      <div>
        <button onClick={onGenerate} disabled={loading} aria-label="Generate SQL">
          {loading ? 'Generating…' : 'Generate SQL'}
        </button>
        <button onClick={onRun} disabled={loading} aria-label="Run" style={{ marginLeft: 8 }}>
          {loading ? 'Running…' : 'Run'}
        </button>
        {error && (
          <span role="alert" style={{ color: 'crimson', marginLeft: 8 }}>{error}</span>
        )}
      </div>
      {results && <ResultsGrid cols={results.cols} rows={results.rows} />}
    </div>
  )
}


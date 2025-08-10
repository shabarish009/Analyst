import React from 'react'
import { useShellStore } from '../state/store'

export const ConnectionManager: React.FC = () => {
  const dbPath = useShellStore((s) => s.dbPath)
  const setDbPath = useShellStore((s) => s.setDbPath)

  return (
    <div aria-label="Connection Manager" style={{ display: 'grid', gap: 6 }}>
      <label htmlFor="dbPath">SQLite file path</label>
      <input
        id="dbPath"
        type="text"
        placeholder="C:\\path\\to\\database.sqlite"
        value={dbPath ?? ''}
        onChange={(e) => setDbPath(e.target.value || null)}
      />
      <div role="status" aria-live="polite">
        {dbPath ? `Connected: ${dbPath}` : 'No database selected'}
      </div>
    </div>
  )
}


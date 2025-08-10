import React from 'react'

type Props = { cols: string[]; rows: any[] }

export const ResultsGrid: React.FC<Props> = ({ cols, rows }) => {
  return (
    <div role="table" aria-label="Results Grid" style={{ maxHeight: 300, overflow: 'auto', border: '1px solid #808080' }}>
      <div role="row" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, minmax(100px, 1fr))`, background: '#d4d0c8', borderBottom: '1px solid #808080' }}>
        {cols.map((c) => (
          <div key={c} role="columnheader" style={{ padding: 4, fontWeight: 600 }}>{c}</div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} role="row" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, minmax(100px, 1fr))` }}>
          {r.map((v: any, j: number) => (
            <div key={j} role="cell" style={{ padding: 4 }}>{String(v)}</div>
          ))}
        </div>
      ))}
    </div>
  )
}


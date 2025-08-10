import React from 'react'
import { SessionData } from '../../state/store'

type Props = { data: SessionData }

export const BarChart: React.FC<Props> = ({ data }) => {
  const rows = data.rows
  const width = 300
  const height = 140
  const pad = 20
  const maxVal = Math.max(1, ...rows.map(r => Number(r[1]) || 0))
  const barW = (width - pad * 2) / Math.max(1, rows.length)
  return (
    <svg role="img" aria-label="BarChart" width={width} height={height} style={{ display: 'block' }}>
      {rows.map((r, i) => {
        const val = Number(r[1]) || 0
        const h = (val / maxVal) * (height - pad * 2)
        const x = pad + i * barW
        const y = height - pad - h
        return <rect key={i} x={x} y={y} width={barW * 0.8} height={h} fill="#0078d4" />
      })}
    </svg>
  )
}


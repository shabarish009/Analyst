import React from 'react'
import { SessionData } from '../../state/store'

type Props = { data: SessionData }

export const LineChart: React.FC<Props> = ({ data }) => {
  const rows = data.rows
  const width = 300
  const height = 140
  const pad = 20
  const maxVal = Math.max(1, ...rows.map(r => Number(r[1]) || 0))
  const points = rows.map((r, i) => {
    const val = Number(r[1]) || 0
    const x = pad + (i * (width - pad * 2)) / Math.max(1, rows.length - 1)
    const y = height - pad - (val / maxVal) * (height - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg role="img" aria-label="LineChart" width={width} height={height} style={{ display: 'block' }}>
      <polyline fill="none" stroke="#0a0" strokeWidth={2} points={points} />
    </svg>
  )
}


import React from 'react'
import { SessionData } from '../../state/store'

type Props = { data: SessionData }

export const KPIStat: React.FC<Props> = ({ data }) => {
  const rows = data.rows
  const total = rows.reduce((acc, r) => acc + (Number(r[1]) || 0), 0)
  return (
    <div role="group" aria-label="KPIStat" style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
      <div style={{ fontWeight: 700, fontSize: 24 }}>{total}</div>
      <div>Total</div>
    </div>
  )
}


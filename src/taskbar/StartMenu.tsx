import React from 'react'

type Props = { open: boolean }
export const StartMenu: React.FC<Props> = ({ open }) => {
  if (!open) return null
  return (
    <div role="menu" aria-label="Start Menu" style={{ position: 'fixed', left: 4, bottom: 36, width: 260, height: 360, background: '#ffffff', border: '2px solid #003c74', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
  )
}


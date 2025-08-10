import React from 'react'

export const StartButton: React.FC<{ onToggle: () => void; open: boolean }> = ({ onToggle, open }) => {
  return (
    <button aria-pressed={open} aria-label="Start" onClick={onToggle} style={{ marginRight: 8 }}>
      Start
    </button>
  )
}


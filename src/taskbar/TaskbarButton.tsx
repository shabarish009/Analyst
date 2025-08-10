import React from 'react'

type TaskbarButtonProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

export const TaskbarButton: React.FC<TaskbarButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      aria-pressed={active}
      aria-label={`Taskbar button: ${label}`}
      onClick={onClick}
      style={{
        padding: '4px 8px',
        margin: 2,
        background: active ? '#cde5ff' : '#e6e6e6',
        border: '1px solid #8a8a8a',
        boxShadow: active ? 'inset 1px 1px 0 #fff' : '1px 1px 0 #fff inset',
      }}
    >
      {label}
    </button>
  )
}


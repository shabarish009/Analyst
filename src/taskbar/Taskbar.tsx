import React from 'react'
import { useShellStore } from '../state/store'
import { TaskbarButton } from './TaskbarButton'
import { StartButton } from './StartButton'
import { StartMenu } from './StartMenu'

export const Taskbar: React.FC = () => {
  const windows = useShellStore((s) => s.windows)
  const startOpen = useShellStore((s) => s.startOpen)
  const toggleStart = useShellStore((s) => s.toggleStart)
  return (
    <>
      <div role="toolbar" aria-label="Taskbar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#d4d0c8', borderTop: '1px solid #808080', padding: 4, display: 'flex', gap: 4 }}>
        <StartButton open={startOpen} onToggle={toggleStart} />
        {windows.map((w) => (
          <TaskbarButton key={w.id} label={w.title} />
        ))}
      </div>
      <StartMenu open={startOpen} />
    </>
  )
}


import React, { useEffect } from 'react'
import { useShellStore } from '../state/store'

type WindowProps = {
  id: string
  title: string
  children?: React.ReactNode
}

export const Window: React.FC<WindowProps> = ({ id, title, children }) => {
  const register = useShellStore((s) => s.register)
  const unregister = useShellStore((s) => s.unregister)
  useEffect(() => {
    register({ id, title })
    return () => unregister(id)
  }, [id, title, register, unregister])
  return (
    <div className="app-window" role="dialog" aria-label={title}>
      <div className="titlebar">{title}</div>
      <div className="content">{children}</div>
    </div>
  )
}


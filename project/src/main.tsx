import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { Window } from './ui/Window'
import { Taskbar } from './taskbar/Taskbar'
import { SQLAnalyst } from './sql/SQLAnalyst'
import { ConnectionManager } from './sql/ConnectionManager'

const App = () => (
  <>
    <div className="center">
      <Window id="win-main" title="Shelby SQL Analyst">
        <div style={{ padding: 12, display: 'grid', gap: 12 }}>
          <ConnectionManager />
          <SQLAnalyst />
        </div>
      </Window>
    </div>
    <Taskbar />
  </>
)

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

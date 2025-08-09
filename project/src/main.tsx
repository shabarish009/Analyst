import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { Window } from './ui/Window'
import { Taskbar } from './taskbar/Taskbar'
import { SQLAnalyst } from './sql/SQLAnalyst'
import { ConnectionManager } from './sql/ConnectionManager'
import { ExcelAnalyst } from './excel/ExcelAnalyst'
import { DashboardCreator } from './dashboard/DashboardCreator'
import { HypothesisTester } from './hypothesis/HypothesisTester'
import { Whiteboard } from './whiteboard/Whiteboard'

const App = () => (
  <>
    <div className="center">
      <Window id="win-main" title="Shelby Workbench">
        <div style={{ padding: 12, display: 'grid', gap: 12 }}>
          <ConnectionManager />
          <ExcelAnalyst />
          <SQLAnalyst />
          <DashboardCreator />
          <HypothesisTester />
          <Whiteboard roomId="demo" />
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

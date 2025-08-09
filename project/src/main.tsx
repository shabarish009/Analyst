import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { Window } from './ui/Window'
import { Taskbar } from './taskbar/Taskbar'

const App = () => (
  <>
    <div className="center">
      <Window id="win-main" title="Shelby">
        <div />
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


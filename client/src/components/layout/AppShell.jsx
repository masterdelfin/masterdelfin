import React from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  )
}

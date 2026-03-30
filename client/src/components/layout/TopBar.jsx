import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar({ title, breadcrumbs = [] }) {
  return (
    <header className="topbar">
      <div className="topbar-content">
        {breadcrumbs.length > 0 && (
          <nav className="topbar-breadcrumb" aria-label="Migas de pan">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <svg className="breadcrumb-sep" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {crumb.href ? (
                  <Link to={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                ) : (
                  <span className="breadcrumb-current">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && <h1 className="topbar-title">{title}</h1>}
      </div>
    </header>
  )
}

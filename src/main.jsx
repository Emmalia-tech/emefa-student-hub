import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function showFatalError(message) {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding:24px;font-family:sans-serif;color:#b91c1c;background:#fef2f2;min-height:100vh;">
        <h2 style="margin-bottom:12px;">Something went wrong</h2>
        <pre style="white-space:pre-wrap;font-size:13px;background:white;padding:12px;border-radius:8px;border:1px solid #fecaca;">${message}</pre>
      </div>
    `
  }
}

window.onerror = (message, source, lineno, colno, error) => {
  showFatalError(`${message}\n\nAt: ${source}:${lineno}:${colno}\n\n${error?.stack || ''}`)
}

window.addEventListener('unhandledrejection', (event) => {
  showFatalError(`Unhandled promise rejection:\n\n${event.reason?.message || event.reason}\n\n${event.reason?.stack || ''}`)
})

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  showFatalError(`${error.message}\n\n${error.stack}`)
}
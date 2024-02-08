import './tailwind.css'
import './global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './components/App'

createRoot(document.querySelector('main')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

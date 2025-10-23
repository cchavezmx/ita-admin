import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CatalogosProvider } from '@/features/catalogos/context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogosProvider>
        <App />
      </CatalogosProvider>
    </BrowserRouter>
  </StrictMode>,
)

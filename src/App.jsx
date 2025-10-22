import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import Dhasbord from '@/pages/Dhasbord.jsx'
import OrdenDeCompra from '@/pages/OrdenDeCompra.jsx'

const linkClass = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
  )

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-neutral-900">ITA Admin</span>
          <nav className="flex items-center gap-2">
            <NavLink to="/dhasbord" className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/orden-de-compra" className={linkClass}>
              Orden de compra
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/dhasbord" replace />} />
        <Route path="/dhasbord" element={<Dhasbord />} />
        <Route path="/orden-de-compra" element={<OrdenDeCompra />} />
        <Route path="*" element={<Navigate to="/dhasbord" replace />} />
      </Routes>
    </div>
  )
}

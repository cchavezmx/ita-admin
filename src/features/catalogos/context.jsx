import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_EMPRESAS, DEFAULT_TIPOS_OC, DEFAULT_CENTROS_COSTO } from './data'

const CatalogosContext = createContext(null)

const STORAGE_KEY = 'ita-admon/catalogos'

const loadFromStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return {
        tiposOc: Array.isArray(parsed.tiposOc) ? parsed.tiposOc : undefined,
        empresas: Array.isArray(parsed.empresas) ? parsed.empresas : undefined,
        centrosCosto: Array.isArray(parsed.centrosCosto) ? parsed.centrosCosto : undefined,
      }
    }
  } catch (error) {
    console.warn('No se pudo leer catálogos desde localStorage', error)
  }
  return null
}

const persistToStorage = (payload) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('No se pudo guardar catálogos en localStorage', error)
  }
}

export function CatalogosProvider({ children }) {
  const [tiposOc, setTiposOc] = useState(DEFAULT_TIPOS_OC)
  const [empresas, setEmpresas] = useState(DEFAULT_EMPRESAS)
  const [centrosCosto, setCentrosCosto] = useState(DEFAULT_CENTROS_COSTO)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = loadFromStorage()
    if (saved?.tiposOc) setTiposOc(saved.tiposOc)
    if (saved?.empresas) setEmpresas(saved.empresas)
    if (saved?.centrosCosto) setCentrosCosto(saved.centrosCosto)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    persistToStorage({ tiposOc, empresas, centrosCosto })
  }, [tiposOc, empresas, centrosCosto])

  const addTipoOc = (entry) => {
    setTiposOc((prev) => {
      const exists = prev.some((item) => item.value === entry.value)
      if (exists) {
        return prev.map((item) => (item.value === entry.value ? entry : item))
      }
      return [...prev, entry]
    })
  }

  const addEmpresa = (entry) => {
    setEmpresas((prev) => {
      const exists = prev.some((item) => item.value === entry.value)
      if (exists) {
        return prev.map((item) => (item.value === entry.value ? entry : item))
      }
      return [...prev, entry]
    })
  }

  const addCentroCosto = (entry) => {
    setCentrosCosto((prev) => {
      const exists = prev.some((item) => item.value === entry.value)
      if (exists) {
        return prev.map((item) => (item.value === entry.value ? entry : item))
      }
      return [...prev, entry]
    })
  }

  const value = useMemo(
    () => ({ tiposOc, empresas, centrosCosto, addTipoOc, addEmpresa, addCentroCosto }),
    [tiposOc, empresas, centrosCosto]
  )

  return <CatalogosContext.Provider value={value}>{children}</CatalogosContext.Provider>
}

export const useCatalogos = () => {
  const context = useContext(CatalogosContext)
  if (!context) {
    throw new Error('useCatalogos debe usarse dentro de CatalogosProvider')
  }
  return context
}

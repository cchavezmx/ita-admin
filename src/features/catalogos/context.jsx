import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_EMPRESAS, DEFAULT_TIPOS_OC } from './data'

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = loadFromStorage()
    if (saved?.tiposOc) setTiposOc(saved.tiposOc)
    if (saved?.empresas) setEmpresas(saved.empresas)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    persistToStorage({ tiposOc, empresas })
  }, [tiposOc, empresas])

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

  const value = useMemo(
    () => ({ tiposOc, empresas, addTipoOc, addEmpresa }),
    [tiposOc, empresas]
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


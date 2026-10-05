import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAppDispatch } from '../store/hooks'
import { DEFAULT_COLORS, setBrandColors, type ThemeColors } from '../store/themeSlice'
import { api } from './api'

export interface Branding {
  projectTitle: string
  clientName: string
  colors: ThemeColors
  logoUrl: string | null
}

interface BrandingValue {
  branding: Branding
  setBranding: (branding: Branding) => void
  reload: () => Promise<void>
}

const BrandingContext = createContext<BrandingValue | null>(null)

const FALLBACK: Branding = { projectTitle: 'Projeto Base', clientName: '', colors: DEFAULT_COLORS, logoUrl: null }

export function BrandingProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const [branding, setBrandingState] = useState<Branding>(FALLBACK)

  const setBranding = useCallback(
    (next: Branding) => {
      setBrandingState(next)
      dispatch(setBrandColors(next.colors))
    },
    [dispatch],
  )

  const reload = useCallback(async () => {
    try {
      setBranding(await api<Branding>('/branding'))
    } catch {
      setBranding(FALLBACK)
    }
  }, [setBranding])

  useEffect(() => {
    reload()
  }, [reload])

  // The favicon is always the branding logo; the tab title is the project title.
  useEffect(() => {
    document.title = branding.projectTitle || FALLBACK.projectTitle
    const link = document.getElementById('favicon') as HTMLLinkElement | null
    if (link) link.href = branding.logoUrl || '/enso/enso-mark.svg'
  }, [branding])

  return <BrandingContext.Provider value={{ branding, setBranding, reload }}>{children}</BrandingContext.Provider>
}

export function useBranding() {
  const value = useContext(BrandingContext)
  if (!value) throw new Error('useBranding must be used inside BrandingProvider')
  return value
}

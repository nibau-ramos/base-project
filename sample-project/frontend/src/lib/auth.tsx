import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'

export type Role = 'super_admin' | 'admin' | 'normal'

export interface User {
  id: number
  email: string
  name: string
  role: Role
  active: boolean
  /** TOTP (authenticator app) is active. */
  otpEnabled: boolean
  /** Number of registered fingerprints (WebAuthn credentials). */
  passkeyCount: number
  /** Set by an admin: the user must keep at least one second factor (TOTP or fingerprint) and set one up at login. */
  mfaRequired: boolean
  createdAt: string
  lastLoginAt: string | null
}

interface AuthValue {
  /** undefined while the session is being checked, null when signed out */
  user: User | null | undefined
  setUser: (user: User | null) => void
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super administrador',
  admin: 'Administrador',
  normal: 'Normal',
}

export const isAdmin = (user: User | null | undefined) => user?.role === 'admin' || user?.role === 'super_admin'

/** At least one second factor (TOTP or fingerprint) is set up. */
export const hasMfa = (user: User) => user.otpEnabled || user.passkeyCount > 0

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  const refresh = useCallback(async () => {
    try {
      setUser((await api<{ user: User }>('/auth/me')).user)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, setUser, refresh, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

/** For pages rendered behind RequireAuth, where the user is always present. */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error('useCurrentUser used outside an authenticated route')
  return user
}

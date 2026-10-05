import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdmin, useAuth } from '../lib/auth'
import { ButtonLink } from '../ui/Button'
import { Spinner } from '../ui/feedback'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (user === undefined) return <Spinner />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (isAdmin(user)) return children
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
        <ShieldAlert size={22} className="text-red-600" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-text-base">Acesso negado</h1>
        <p className="text-sm text-text-muted mt-1">Esta área está disponível apenas para administradores.</p>
      </div>
      <ButtonLink to="/admin" variant="subtle">Voltar ao painel</ButtonLink>
    </div>
  )
}

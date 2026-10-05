import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2, X } from 'lucide-react'
import type { ReactNode } from 'react'

// Alerts, badges and spinner from the style guide (/styleguide/feedback).

export type AlertType = 'info' | 'success' | 'warning' | 'error'

const alertConfig: Record<AlertType, { icon: ReactNode; classes: string }> = {
  info: {
    icon: <Info size={16} />,
    classes: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300',
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    classes: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    classes: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
  },
  error: {
    icon: <AlertCircle size={16} />,
    classes: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300',
  },
}

export function Alert({
  type = 'error',
  title,
  children,
  onClose,
}: {
  type?: AlertType
  title?: ReactNode
  children?: ReactNode
  onClose?: () => void
}) {
  if (!children && !title) return null
  const cfg = alertConfig[type]
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left ${cfg.classes}`}
    >
      <span className="flex-shrink-0 mt-0.5">{cfg.icon}</span>
      <div className="flex-1 min-w-0 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'opacity-80 mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100" aria-label="Fechar">
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'

const badgeConfig: Record<BadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary dark:bg-white/10 dark:text-white',
  success: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300',
  neutral: 'bg-surface text-text-muted border border-border',
}

export function Badge({ variant = 'neutral', icon, children }: { variant?: BadgeVariant; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badgeConfig[variant]}`}>
      {icon}
      {children}
    </span>
  )
}

export function Spinner({ label = 'A carregar…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-text-muted" role="status">
      <Loader2 size={18} className="animate-spin text-primary" />
      {label}
    </div>
  )
}

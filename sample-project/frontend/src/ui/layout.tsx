import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

// Page structure pieces from the style guide (/styleguide/cards, /styleguide/navigation).

export function PageHeader({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-text-base break-words">{title}</h1>
        {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>}
    </div>
  )
}

export function Card({
  title,
  description,
  actions,
  children,
  className = '',
}: {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface p-5 min-w-0 ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-text-base">{title}</h2>}
            {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-bg border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-base">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-base transition-theme" aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 px-5 py-4 border-t border-border">{footer}</div>}
      </div>
    </div>
  )
}

export function Tabs({ items }: { items: { to: string; label: string; icon?: ReactNode }[] }) {
  return (
    <nav className="flex border-b border-border mb-6 overflow-x-auto">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap -mb-px border-b-2 transition-theme
            ${isActive ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base'}`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Initials avatar, as in the style guide's users list. */
export function Avatar({ name, email }: { name: string; email: string }) {
  const source = name.trim() || email
  const initials = source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary text-white text-xs font-semibold">
      {initials}
    </div>
  )
}

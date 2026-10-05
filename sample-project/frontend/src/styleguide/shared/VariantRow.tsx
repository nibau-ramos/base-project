import { ReactNode } from 'react'

interface VariantRowProps {
  name: string
  description: ReactNode
  children: ReactNode
  /** Use quando o componente é largo e não cabe ao lado da descrição */
  stack?: boolean
}

export default function VariantRow({ name, description, children, stack }: VariantRowProps) {
  if (stack) {
    return (
      <div className="px-5 py-5 border-b border-border last:border-0 space-y-4">
        {/* Name + description na mesma linha */}
        <div className="flex items-start gap-4">
          <span className="w-28 flex-shrink-0 text-xs font-semibold font-mono text-text-muted uppercase tracking-wide pt-0.5">
            {name}
          </span>
          <p className="flex-1 text-sm text-text-muted leading-relaxed">{description}</p>
        </div>
        {/* Componente por baixo, largura total */}
        <div className="w-full pl-0">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 px-5 py-5 border-b border-border last:border-0">
      {/* Left: name + component */}
      <div className="flex items-center gap-4 flex-shrink-0 md:w-72">
        <span className="w-28 flex-shrink-0 text-xs font-semibold font-mono text-text-muted uppercase tracking-wide">
          {name}
        </span>
        <div className="flex-shrink-0">{children}</div>
      </div>

      {/* Vertical divider (desktop) */}
      <div className="hidden md:block w-px self-stretch bg-border flex-shrink-0" />

      {/* Right: description */}
      <p className="flex-1 text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

interface BProps { children: ReactNode }
export function B({ children }: BProps) {
  return <strong className="font-semibold text-text-base">{children}</strong>
}

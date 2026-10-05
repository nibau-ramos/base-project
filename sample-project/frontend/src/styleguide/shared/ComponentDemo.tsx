import { useState, ReactNode } from 'react'
import { Code2, EyeOff } from 'lucide-react'
import CodeBlock from './CodeBlock'

interface ComponentDemoProps {
  title: string
  description?: string
  code: string
  children: ReactNode
  language?: string
  layout?: 'flex' | 'rows'
}

export default function ComponentDemo({
  title,
  description,
  code,
  children,
  language,
  layout = 'flex',
}: ComponentDemoProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div>
          <h3 className="text-sm font-semibold text-text-base">{title}</h3>
          {description && (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg
            text-text-muted hover:text-text-base hover:bg-surface-hover transition-theme"
        >
          {showCode ? <EyeOff size={13} /> : <Code2 size={13} />}
          {showCode ? 'Fechar' : 'Ver código'}
        </button>
      </div>

      {/* Demo area */}
      <div className={layout === 'rows' ? 'bg-bg' : 'p-6 bg-bg flex flex-wrap items-center gap-3'}>
        {children}
      </div>

      {/* Code panel */}
      {showCode && (
        <div className="border-t border-border">
          <CodeBlock code={code} language={language} />
        </div>
      )}
    </div>
  )
}

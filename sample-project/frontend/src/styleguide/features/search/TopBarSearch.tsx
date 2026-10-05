import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ALL_COMPONENTS } from '../../data/components'

export default function TopBarSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return ALL_COMPONENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)) ||
        c.page.toLowerCase().includes(q),
    ).slice(0, 7)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (path: string) => {
    navigate(path)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
      inputRef.current?.blur()
    }
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0].path)
    }
  }

  return (
    <div ref={ref} className="relative hidden sm:block">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar..."
          className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-surface
            text-text-base placeholder:text-text-muted
            focus:w-72 focus:border-primary focus:ring-2 focus:ring-primary/20
            outline-none transition-all duration-200"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full right-0 mt-1.5 w-72 bg-bg border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-text-muted">{results.length} resultado{results.length !== 1 ? 's' : ''}</p>
          </div>
          <ul>
            {results.map((r) => (
              <li key={`${r.page}-${r.name}`}>
                <button
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(r.path) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-surface-hover transition-theme text-left group"
                >
                  <div>
                    <p className="text-sm font-medium text-text-base group-hover:text-primary transition-theme">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.page}</p>
                  </div>
                  <ArrowRight size={13} className="text-text-muted group-hover:text-primary transition-theme flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full right-0 mt-1.5 w-64 bg-bg border border-border rounded-xl shadow-xl z-50 p-4">
          <p className="text-sm text-text-muted text-center">Sem resultados para "{query}"</p>
        </div>
      )}
    </div>
  )
}

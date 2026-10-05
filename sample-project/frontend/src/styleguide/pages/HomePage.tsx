import { Link } from 'react-router-dom'
import { Type, Square, ToggleLeft, Bell, LayoutGrid, Table2, Navigation, ArrowRight } from 'lucide-react'
import { ALL_COMPONENTS } from '../data/components'

const PAGE_CARDS = [
  { label: 'Tipografia',       path: '/styleguide/typography', icon: Type,       count: 5,  description: 'Escala de headings, body, pesos e cores de texto' },
  { label: 'Botões',           path: '/styleguide/buttons',    icon: Square,     count: 9,  description: 'Primary, secondary, ghost, outline, destructive, FAB' },
  { label: 'Inputs & Forms',   path: '/styleguide/inputs',     icon: ToggleLeft, count: 10, description: 'Text, password, textarea, select, checkbox, radio, toggle, drop zone, image upload' },
  { label: 'Feedback & Estado',path: '/styleguide/feedback',   icon: Bell,       count: 10, description: 'Alerts, badges, spinners, progress, skeletons, tags, stepper' },
  { label: 'Cards & Modais',   path: '/styleguide/cards',      icon: LayoutGrid, count: 6,  description: 'Cards básicos, clicáveis, modais, drawers, confirmação' },
  { label: 'Tabelas & Listas', path: '/styleguide/tables',     icon: Table2,     count: 5,  description: 'Tabelas com sort, listas com ícones, acções de linha' },
  { label: 'Navegação',        path: '/styleguide/navigation', icon: Navigation, count: 4,  description: 'Navbar, breadcrumb, tabs, paginação' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold tracking-widest text-text-muted uppercase">ENSO ORIGINS</span>
        </div>
        <h1 className="text-4xl font-bold text-text-base">Style Guide</h1>
        <p className="text-text-muted mt-2 max-w-xl">
          Referência visual para todos os projetos web da ENSO. Usa a barra de pesquisa no topo para encontrar qualquer componente, ou altera as cores para ver as mudanças em tempo real.
        </p>
      </div>

      {/* Page cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGE_CARDS.map(({ label, path, icon: Icon, count, description }) => (
          <Link
            key={path}
            to={path}
            className="group rounded-xl border border-border bg-surface p-5
              hover:border-primary/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary)1a' }}>
                <Icon size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-xs text-text-muted">{count} componentes</span>
            </div>
            <h2 className="text-sm font-semibold text-text-base group-hover:text-primary transition-theme">{label}</h2>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>
            <div className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ver componentes</span>
              <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-text-base">{ALL_COMPONENTS.length}</p>
          <p className="text-xs text-text-muted mt-0.5">Componentes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-base">{PAGE_CARDS.length}</p>
          <p className="text-xs text-text-muted mt-0.5">Categorias</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-text-base">4</p>
          <p className="text-xs text-text-muted mt-0.5">Cores base</p>
        </div>
      </div>
    </div>
  )
}

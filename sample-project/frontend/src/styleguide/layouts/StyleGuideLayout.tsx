import { Link, Outlet, NavLink, useLocation } from 'react-router-dom'
import { Suspense, useState } from 'react'
import {
  Type,
  Square,
  ToggleLeft,
  Bell,
  LayoutGrid,
  Table2,
  Navigation,
  Menu,
  Home,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogIn,
  Users,
  UserPlus,
  UserCog,
} from 'lucide-react'
import ColorConfigurator from '../features/theme/ColorConfigurator'
import ThemeToggle from '../features/theme/ThemeToggle'
import TopBarSearch from '../features/search/TopBarSearch'
import { useAppSelector } from '../../store/hooks'

const NAV_ITEMS = [
  { to: '/styleguide/styleguide', label: 'Início', icon: Home, end: true },
  { to: '/styleguide/typography', label: 'Tipografia', icon: Type, end: true },
  { to: '/styleguide/buttons', label: 'Botões', icon: Square, end: true },
  { to: '/styleguide/inputs', label: 'Inputs & Forms', icon: ToggleLeft, end: true },
  { to: '/styleguide/feedback', label: 'Feedback & Estado', icon: Bell, end: true },
  { to: '/styleguide/cards', label: 'Cards & Modais', icon: LayoutGrid, end: true },
  { to: '/styleguide/tables', label: 'Tabelas & Listas', icon: Table2, end: true },
  { to: '/styleguide/navigation', label: 'Navegação', icon: Navigation, end: true },
]

const EXAMPLE_ITEMS = [
  { to: '/styleguide/examples/login',      label: 'Login',               icon: LogIn,   end: true  },
  { to: '/styleguide/examples/users',      label: 'Utilizadores',         icon: Users,   end: true  },
  { to: '/styleguide/examples/users/new',  label: 'Criar utilizador',    icon: UserPlus, end: true },
  { to: '/styleguide/examples/users/1',    label: 'Detalhes utilizador', icon: UserCog, end: false  },
]

const SETTINGS_ITEM = { to: '/styleguide/settings', label: 'Configuração', icon: Settings, end: true }

export default function StyleGuideLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isDarkMode = useAppSelector((s) => s.theme.isDarkMode)
  const logoUrl = useAppSelector((s) => s.theme.logoUrl)
  const location = useLocation()

  const defaultLogoSrc = isDarkMode
    ? '/enso/EnsoOrigins_logo_poli_neg_rgb.svg'
    : '/enso/EnsoOrigins_logo_poli_pos_rgb.svg'
  const logoSrc = logoUrl ?? defaultLogoSrc

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      setCollapsed((c) => !c)
    } else {
      setSidebarOpen((o) => !o)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      {/* TopBar */}
      <header className="flex items-center justify-between px-3 h-14 border-b border-border bg-bg z-20 flex-shrink-0 gap-3">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleMenuClick}
            className="p-2 rounded-lg hover:bg-surface-hover transition-theme text-text-muted"
            title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            <Menu size={17} />
          </button>
          <Link to="/" title="Voltar ao site">
            <img src={logoSrc} alt="ENSO ORIGINS" className="h-6 w-auto" />
          </Link>
          <span className="text-xs font-medium text-text-muted border-l border-border pl-3 hidden md:inline">
            Style Guide
          </span>
        </div>

        {/* Center: search */}
        <div className="flex-1 flex justify-center max-w-sm mx-2">
          <TopBarSearch />
        </div>

        {/* Right: color pickers + theme toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ColorConfigurator />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative top-14 lg:top-0 left-0 h-[calc(100vh-3.5rem)] lg:h-full
            flex-shrink-0 border-r border-border bg-surface z-10
            flex flex-col overflow-hidden
            transition-all duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${collapsed ? 'lg:w-14' : 'lg:w-56'}
            w-56
          `}
        >
          <nav className="p-2 flex flex-col gap-0.5 flex-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-theme
                  ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                  ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-surface-hover hover:text-text-base'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className="flex-shrink-0" style={{ color: isActive ? 'var(--color-primary)' : undefined }} />
                    <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Divider + Exemplos */}
            <div className="my-1 mx-1 border-t border-border" />
            <div className={`px-2.5 py-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">Exemplos</span>
            </div>
            {EXAMPLE_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-theme
                  ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-hover hover:text-text-base'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className="flex-shrink-0" style={{ color: isActive ? 'var(--color-primary)' : undefined }} />
                    <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Divider + Settings */}
            <div className="my-1 mx-1 border-t border-border" />
            <NavLink
              to={SETTINGS_ITEM.to}
              end={SETTINGS_ITEM.end}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? SETTINGS_ITEM.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-theme
                ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                ${isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-hover hover:text-text-base'}`
              }
            >
              {({ isActive }) => (
                <>
                  <SETTINGS_ITEM.icon size={16} className="flex-shrink-0" style={{ color: isActive ? 'var(--color-primary)' : undefined }} />
                  <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{SETTINGS_ITEM.label}</span>
                </>
              )}
            </NavLink>
          </nav>

          {/* Collapse toggle (desktop only) */}
          <div className="hidden lg:flex border-t border-border p-2">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg w-full text-xs text-text-muted
                hover:bg-surface-hover hover:text-text-base transition-theme
                ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              {collapsed ? <ChevronRight size={14} /> : (
                <>
                  <ChevronLeft size={14} />
                  <span>Colapsar</span>
                </>
              )}
            </button>
          </div>

          {/* Version (only when expanded) */}
          {!collapsed && (
            <div className="lg:block hidden px-4 pb-3">
              <p className="text-xs text-text-muted">ENSO ORIGINS · v0.1.0</p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main key={location.pathname} className="flex-1 overflow-y-auto bg-bg">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  Settings,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { isAdmin, ROLE_LABELS, useCurrentUser, useAuth } from '../lib/auth'
import { useAppConfig } from '../lib/config'
import ThemeToggle from '../styleguide/features/theme/ThemeToggle'
import { Avatar } from '../ui/layout'
import PoweredBy from '../ui/PoweredBy'
import BrandLogo from './BrandLogo'

// Back-office shell, modelled on the style guide layout (StyleGuideLayout.tsx): top bar, collapsible icon sidebar.

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Utilizadores', icon: Users, adminOnly: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings, adminOnly: true },
  { to: '/admin/profile', label: 'O meu perfil', icon: UserRound },
]

const EXTERNAL_ITEMS: NavItem[] = [
  { to: '/', label: 'Ver site público', icon: ExternalLink, end: true },
  { to: '/styleguide', label: 'Style guide', icon: Palette },
]

const COLLAPSED_KEY = 'admin:sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

function SidebarLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-theme
        ${collapsed ? 'lg:justify-center lg:px-2' : ''}
        ${isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-hover hover:text-text-base'}`
      }
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
    </NavLink>
  )
}

function UserMenu() {
  const user = useCurrentUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 p-1 pr-2 rounded-xl hover:bg-surface-hover transition-theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} email={user.email} />
        <span className="hidden md:flex flex-col items-start leading-tight min-w-0">
          <span className="text-sm font-medium text-text-base max-w-40 truncate">{user.name || user.email}</span>
          <span className="text-xs text-text-muted">{ROLE_LABELS[user.role]}</span>
        </span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-1.5 w-60 bg-bg border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-text-base truncate">{user.name || user.email}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
          <Link
            to="/admin/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-base hover:bg-surface-hover transition-theme"
          >
            <UserRound size={15} className="text-text-muted" /> O meu perfil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-theme"
          >
            <LogOut size={15} /> Terminar sessão
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminLayout() {
  const user = useCurrentUser()
  const { mailpitUrl } = useAppConfig()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)

  useEffect(() => setSidebarOpen(false), [location.pathname])

  function toggleCollapsed() {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, c ? '0' : '1')
      } catch {
        // not critical
      }
      return !c
    })
  }

  const handleMenuClick = () => (window.innerWidth >= 1024 ? toggleCollapsed() : setSidebarOpen((o) => !o))
  const items = NAV_ITEMS.filter((i) => !i.adminOnly || isAdmin(user))

  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-bg">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 h-14 border-b border-border bg-bg z-20 flex-shrink-0 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleMenuClick}
            className="p-2 rounded-lg hover:bg-surface-hover transition-theme text-text-muted flex-shrink-0"
            aria-label="Menu"
          >
            <Menu size={17} />
          </button>
          <Link to="/admin" className="min-w-0">
            <BrandLogo size="sm" />
          </Link>
          <span className="text-xs font-medium text-text-muted border-l border-border pl-3 hidden md:inline">Back-office</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside
          className={`fixed lg:relative top-14 lg:top-0 left-0 h-[calc(100dvh-3.5rem)] lg:h-full flex-shrink-0
            border-r border-border bg-surface z-10 flex flex-col overflow-hidden transition-all duration-200 w-56
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${collapsed ? 'lg:w-14' : 'lg:w-56'}`}
        >
          <nav className="p-2 flex flex-col gap-0.5 flex-1 overflow-y-auto">
            {items.map((item) => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} onNavigate={() => setSidebarOpen(false)} />
            ))}
            <div className="my-1 mx-1 border-t border-border" />
            {EXTERNAL_ITEMS.map((item) => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} onNavigate={() => setSidebarOpen(false)} />
            ))}
            {mailpitUrl && (
              <a
                href={mailpitUrl}
                target="_blank"
                rel="noreferrer"
                title={collapsed ? 'Mailpit (e-mails de teste)' : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-theme
                  text-text-muted hover:bg-surface-hover hover:text-text-base ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
              >
                <Inbox size={16} className="flex-shrink-0" />
                <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Mailpit</span>
              </a>
            )}
          </nav>

          <div className="hidden lg:flex border-t border-border p-2">
            <button
              onClick={toggleCollapsed}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg w-full text-xs text-text-muted
                hover:bg-surface-hover hover:text-text-base transition-theme ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
            >
              {collapsed ? (
                <ChevronRight size={14} />
              ) : (
                <>
                  <ChevronLeft size={14} />
                  <span>Colapsar</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-bg flex flex-col min-w-0">
          <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <Outlet />
          </div>
          <footer className="flex justify-center py-6 border-t border-border">
            <PoweredBy />
          </footer>
        </main>
      </div>
    </div>
  )
}

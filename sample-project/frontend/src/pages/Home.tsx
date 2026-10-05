import { ArrowRight, CalendarClock, LayoutGrid, LockKeyhole, Palette, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../lib/auth'
import { useBranding } from '../lib/branding'
import { formatDate } from '../lib/dates'
import ThemeToggle from '../styleguide/features/theme/ThemeToggle'
import { ButtonLink } from '../ui/Button'

// Public front-end: no authentication. Replace with the project's real public pages.

const FEATURES = [
  {
    icon: LockKeyhole,
    title: 'Back-office em /admin',
    text: 'Login por e-mail e password, OTP, recuperação de password e gestão de utilizadores por perfil.',
    to: '/admin',
  },
  {
    icon: Palette,
    title: 'Style guide',
    text: 'Todos os componentes visuais ENSO, com pesquisa, cores configuráveis e modo escuro.',
    to: '/styleguide',
  },
  {
    icon: LayoutGrid,
    title: 'Exemplos de ecrãs',
    text: 'Login, lista e formulário de utilizadores, prontos a servir de base a novos ecrãs.',
    to: '/styleguide/examples/login',
  },
]

export default function Home() {
  const { branding } = useBranding()
  const { user } = useAuth()
  const now = new Date()

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
          <Link to="/" className="min-w-0">
            <BrandLogo />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/styleguide"
              className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-base hover:bg-surface-hover transition-theme"
            >
              Style guide
            </Link>
            <ThemeToggle />
            <ButtonLink to={user ? '/admin' : '/login'} size="sm">
              {user ? 'Back-office' : 'Entrar'}
            </ButtonLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24">
          {branding.clientName && (
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">{branding.clientName}</span>
          )}
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-text-base tracking-tight">{branding.projectTitle}</h1>
          <p className="mt-4 text-lg text-text-muted max-w-2xl">
            Esta é a zona pública da aplicação, acessível sem autenticação. Serve de ponto de partida para o site do
            projeto; a gestão da plataforma está no back-office.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={user ? '/admin' : '/login'} size="lg" icon={<ArrowRight size={18} />}>
              {user ? 'Ir para o back-office' : 'Entrar no back-office'}
            </ButtonLink>
            <ButtonLink to="/styleguide" size="lg" variant="subtle" icon={<Palette size={18} />}>
              Consultar style guide
            </ButtonLink>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, text, to }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border border-border bg-surface p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                  <Icon size={18} className="text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-text-base group-hover:text-primary transition-theme">{title}</h2>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{text}</p>
                <span className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Smartphone size={18} className="text-text-muted mt-0.5" />
              <p className="text-sm text-text-muted">Responsivo em desktop, tablet e telemóvel.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-text-muted mt-0.5" />
              <p className="text-sm text-text-muted">Perfis super administrador, administrador e normal.</p>
            </div>
            <div className="flex items-start gap-3">
              <CalendarClock size={18} className="text-text-muted mt-0.5" />
              <p className="text-sm text-text-muted">
                Datas sempre em YYYY/MM/DD — hoje é {formatDate(now)}, {formatDate(now, 'datetime').slice(11)}.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-text-muted flex flex-wrap justify-between gap-2">
          <span>
            {branding.projectTitle}
            {branding.clientName ? ` · ${branding.clientName}` : ''}
          </span>
          <a href="https://enso-origins.com" target="_blank" rel="noreferrer" className="hover:text-text-base transition-theme">
            ENSO ORIGINS
          </a>
        </div>
      </footer>
    </div>
  )
}

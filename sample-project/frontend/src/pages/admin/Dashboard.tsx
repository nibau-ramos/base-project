import { ArrowRight, KeyRound, Mail, Palette, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasMfa, isAdmin, ROLE_LABELS, useCurrentUser } from '../../lib/auth'
import { formatDate } from '../../lib/dates'
import { Badge } from '../../ui/feedback'
import { Card, PageHeader } from '../../ui/layout'

interface Shortcut {
  to: string
  icon: LucideIcon
  title: string
  text: string
  adminOnly?: boolean
}

const SHORTCUTS: Shortcut[] = [
  { to: '/admin/users', icon: Users, title: 'Utilizadores', text: 'Criar contas, perfis e e-mails de boas-vindas.', adminOnly: true },
  { to: '/admin/settings/email', icon: Mail, title: 'Envio de e-mail', text: 'Servidor SMTP e e-mail de teste.', adminOnly: true },
  { to: '/admin/settings/branding', icon: Palette, title: 'Branding', text: 'Logótipo, título, cliente e cores.', adminOnly: true },
  { to: '/admin/profile', icon: KeyRound, title: 'O meu perfil', text: 'Alterar password, impressão digital e aplicação autenticadora.' },
]

export default function Dashboard() {
  const user = useCurrentUser()
  const shortcuts = SHORTCUTS.filter((s) => !s.adminOnly || isAdmin(user))

  return (
    <>
      <PageHeader title={`Olá${user.name ? `, ${user.name.split(' ')[0]}` : ''}`} description="Bem-vindo ao back-office." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {shortcuts.map(({ to, icon: Icon, title, text }) => (
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

      <Card title="A tua conta">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="min-w-0">
            <dt className="text-xs text-text-muted">E-mail</dt>
            <dd className="font-medium text-text-base mt-0.5 truncate">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Perfil</dt>
            <dd className="mt-1">
              <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Verificação em dois passos</dt>
            <dd className="mt-1">
              {hasMfa(user) ? (
                <Badge variant="success" icon={<ShieldCheck size={12} />}>Ativa</Badge>
              ) : (
                <Badge variant="warning">Inativa</Badge>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Último acesso</dt>
            <dd className="font-medium text-text-base mt-0.5">{formatDate(user.lastLoginAt, 'datetime') || '—'}</dd>
          </div>
        </dl>
      </Card>
    </>
  )
}

import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Lock, Mail, Pencil, Plus, Search, ShieldCheck, Trash2, XCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, errorMessage } from '../../lib/api'
import { ROLE_LABELS, useCurrentUser, type Role, type User } from '../../lib/auth'
import { formatDate } from '../../lib/dates'
import { Button, ButtonLink, IconButton } from '../../ui/Button'
import { Alert, Badge, Spinner } from '../../ui/feedback'
import { Avatar, PageHeader } from '../../ui/layout'
import { DeleteUserModal, WelcomeModal } from './userModals'

// Mirrors the backend rule: admins manage admins and normal users; super admins manage everyone.
export const assignableRoles = (actor: Role): Role[] => (actor === 'super_admin' ? ['super_admin', 'admin', 'normal'] : ['admin', 'normal'])

type SortKey = 'name' | 'role' | 'lastLoginAt'
type StatusFilter = 'all' | 'active' | 'inactive'

function StatusBadge({ user }: { user: User }) {
  return user.active ? (
    <Badge variant="success" icon={<CheckCircle2 size={12} />}>Ativo</Badge>
  ) : (
    <Badge variant="error" icon={<XCircle size={12} />}>Inativo</Badge>
  )
}

function OtpBadge({ user }: { user: User }) {
  if (user.otpEnabled) {
    return (
      <Badge variant="primary" icon={user.otpRequired ? <Lock size={12} /> : <ShieldCheck size={12} />}>
        {user.otpRequired ? 'OTP obrigatório' : 'OTP'}
      </Badge>
    )
  }
  return user.otpRequired ? <Badge variant="warning" icon={<Lock size={12} />}>OTP por configurar</Badge> : null
}

export default function Users() {
  const me = useCurrentUser()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[] | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null)
  const [welcomeTarget, setWelcomeTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const canManage = (u: User) => assignableRoles(me.role).includes(u.role)

  const load = useCallback(() => {
    api<{ users: User[] }>('/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(errorMessage(err)))
  }, [])

  useEffect(load, [load])

  function toggleSort(key: SortKey) {
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = (users ?? []).filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.email.includes(q)) &&
        (roleFilter === 'all' || u.role === roleFilter) &&
        (statusFilter === 'all' || (statusFilter === 'active') === u.active),
    )
    if (!sort) return list
    const value = (u: User) => (sort.key === 'name' ? u.name || u.email : sort.key === 'role' ? ROLE_LABELS[u.role] : u.lastLoginAt ?? '')
    return [...list].sort((a, b) => value(a).localeCompare(value(b), 'pt') * (sort.dir === 'asc' ? 1 : -1))
  }, [users, search, roleFilter, statusFilter, sort])

  if (!users) return error ? <Alert>{error}</Alert> : <Spinner />

  const counts = {
    active: users.filter((u) => u.active).length,
    inactive: users.filter((u) => !u.active).length,
    otp: users.filter((u) => u.otpEnabled).length,
  }

  const SortHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th className="py-3 px-4 font-medium text-text-muted">
      <button onClick={() => toggleSort(col)} className="flex items-center gap-1.5 hover:text-text-base transition-theme select-none">
        {label}
        {sort?.key !== col ? <ArrowUpDown size={11} className="opacity-40" /> : sort.dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
      </button>
    </th>
  )

  const actions = (u: User) =>
    canManage(u) && (
      <div className="flex items-center justify-end gap-1">
        <IconButton label="Enviar e-mail de boas-vindas" tone="primary" onClick={() => setWelcomeTarget(u)}>
          <Mail size={15} />
        </IconButton>
        <IconButton label="Editar" tone="primary" onClick={() => navigate(`/admin/users/${u.id}`)}>
          <Pencil size={15} />
        </IconButton>
        {u.id !== me.id && (
          <IconButton label="Eliminar" tone="danger" onClick={() => setDeleteTarget(u)}>
            <Trash2 size={15} />
          </IconButton>
        )}
      </div>
    )

  return (
    <>
      {welcomeTarget && (
        <WelcomeModal
          user={welcomeTarget}
          onClose={() => setWelcomeTarget(null)}
          onSent={(msg) => {
            setWelcomeTarget(null)
            setMessage(msg)
          }}
        />
      )}
      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null)
            setMessage(`Utilizador ${deleteTarget.email} eliminado.`)
            load()
          }}
        />
      )}

      <PageHeader
        title="Utilizadores"
        description="O e-mail é o identificador de login de cada utilizador."
        actions={
          <ButtonLink to="/admin/users/new" icon={<Plus size={15} />}>
            Novo utilizador
          </ButtonLink>
        }
      />

      <div className="space-y-3 mb-5">
        <Alert>{error}</Alert>
        {message && (
          <Alert type="success" onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Ativos', count: counts.active, cls: 'text-green-700 dark:text-green-300' },
          { label: 'Inativos', count: counts.inactive, cls: 'text-red-700 dark:text-red-300' },
          { label: 'Com OTP', count: counts.otp, cls: 'text-primary' },
        ].map(({ label, count, cls }) => (
          <div key={label} className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className={`text-xl font-bold ${cls}`}>{count}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative basis-full sm:basis-auto flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Pesquisar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-bg text-text-base placeholder:text-text-muted
              outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-theme"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
          aria-label="Filtrar por perfil"
          className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-xl border border-border bg-bg text-text-base outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-theme cursor-pointer"
        >
          <option value="all">Todos os perfis</option>
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          aria-label="Filtrar por estado"
          className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-xl border border-border bg-bg text-text-base outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-theme cursor-pointer"
        >
          <option value="all">Todos os estados</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <SortHeader col="name" label="Utilizador" />
              <SortHeader col="role" label="Perfil" />
              <th className="py-3 px-4 font-medium text-text-muted">Estado</th>
              <SortHeader col="lastLoginAt" label="Último acesso" />
              <th className="py-3 px-4 font-medium text-text-muted text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-text-muted">Nenhum utilizador encontrado.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-surface-hover transition-theme last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={u.name} email={u.email} />
                      <div className="min-w-0">
                        <p className="font-medium text-text-base truncate">{u.name || '—'}</p>
                        <p className="text-xs text-text-muted truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted whitespace-nowrap">{ROLE_LABELS[u.role]}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge user={u} />
                      <OtpBadge user={u} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted whitespace-nowrap">{formatDate(u.lastLoginAt, 'datetime') || '—'}</td>
                  <td className="py-3 px-4">{actions(u)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && <p className="text-center py-12 text-sm text-text-muted">Nenhum utilizador encontrado.</p>}
        {filtered.map((u) => (
          <div key={u.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={u.name} email={u.email} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-text-base truncate">{u.name || '—'}</p>
                <p className="text-xs text-text-muted truncate">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              <Badge variant="neutral">{ROLE_LABELS[u.role]}</Badge>
              <StatusBadge user={u} />
              <OtpBadge user={u} />
            </div>
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-xs text-text-muted">Último acesso: {formatDate(u.lastLoginAt, 'datetime') || '—'}</span>
              {actions(u)}
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-text-muted mt-3 px-1">
          {filtered.length} de {users.length} utilizadores
        </p>
      )}

      {users.length === 1 && (
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-text-muted mb-3">Ainda és o único utilizador da plataforma.</p>
          <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => navigate('/admin/users/new')}>
            Convidar alguém
          </Button>
        </div>
      )}
    </>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Plus, ArrowUpDown, ArrowUp, ArrowDown,
  CheckCircle2, Clock, XCircle, Pencil, Trash2, X,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { deleteUser, type User, type UserStatus } from '../../../store/usersSlice'

/* ── helpers ─────────────────────────────────────────────────────────────── */

const STATUS_CFG: Record<UserStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  active:   { label: 'Activo',   icon: <CheckCircle2 size={12} />, cls: 'text-green-700 bg-green-50  dark:text-green-300 dark:bg-green-950/40' },
  pending:  { label: 'Pendente', icon: <Clock size={12} />,         cls: 'text-amber-700 bg-amber-50  dark:text-amber-300 dark:bg-amber-950/40' },
  inactive: { label: 'Inactivo', icon: <XCircle size={12} />,       cls: 'text-red-700   bg-red-50    dark:text-red-300   dark:bg-red-950/40'   },
}

const DEPT_COLORS: Record<string, string> = {
  Design: '#0086ac', Tecnologia: '#8b5cf6', Estratégia: '#10b981',
  Marketing: '#f97316', Operações: '#f59e0b', Gestão: '#ef4444',
}

function Avatar({ name, department }: { name: string; department: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const bg = DEPT_COLORS[department] ?? 'var(--color-primary)'
  return (
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: bg }}>
      {initials}
    </div>
  )
}

type SortKey = 'name' | 'role' | 'department' | 'projects'
type SortDir = 'asc' | 'desc' | null

/* ── Delete modal ────────────────────────────────────────────────────────── */

function ConfirmDeleteModal({ user, onCancel, onConfirm }: {
  user: User; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-bg border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-base">Eliminar utilizador</h2>
          <button onClick={onCancel} className="text-text-muted hover:text-text-base transition-theme">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-text-muted">
            Tens a certeza que pretendes eliminar{' '}
            <strong className="text-text-base">{user.name}</strong>? Esta acção é{' '}
            <strong className="text-text-base">permanente e irreversível</strong>.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-border text-text-muted hover:bg-surface-hover transition-theme"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-theme"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function UsersListPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) => s.users.list)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  function handleSort(key: SortKey) {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null); setSortDir(null)
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={11} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
  }

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase()
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.role.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      return true
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      const av = a[sortKey], bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), 'pt')
      return sortDir === 'asc' ? cmp : -cmp
    })

  const counts = {
    active: users.filter((u) => u.status === 'active').length,
    pending: users.filter((u) => u.status === 'pending').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
  }

  function handleDelete() {
    if (!deleteTarget) return
    dispatch(deleteUser(deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmDeleteModal
          user={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-base">Utilizadores</h1>
            <p className="text-sm text-text-muted mt-1">Gestão de membros da equipa.</p>
          </div>
          <button
            onClick={() => navigate('/styleguide/examples/users/new')}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl text-white flex-shrink-0 transition-theme"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus size={15} /> Novo utilizador
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Activos',   count: counts.active,   cls: 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/30' },
            { label: 'Pendentes', count: counts.pending,  cls: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/30' },
            { label: 'Inactivos', count: counts.inactive, cls: 'text-red-700   bg-red-50   dark:text-red-300   dark:bg-red-950/30'   },
          ].map(({ label, count, cls }) => (
            <div key={label} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className={`text-xl font-bold ${cls.split(' ')[0]}`}>{count}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou cargo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-bg
                text-text-base placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-theme"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 text-sm rounded-xl border border-border bg-bg text-text-base outline-none
              focus:ring-2 focus:ring-primary/10 focus:border-primary transition-theme cursor-pointer"
          >
            <option value="all">Todos os estados</option>
            <option value="active">Activo</option>
            <option value="pending">Pendente</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left">
                  {([
                    { key: 'name' as SortKey,       label: 'Utilizador' },
                    { key: 'role' as SortKey,       label: 'Cargo' },
                    { key: 'department' as SortKey, label: 'Departamento' },
                  ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="py-3 px-4 font-medium text-text-muted cursor-pointer hover:text-text-base transition-theme select-none"
                    >
                      <div className="flex items-center gap-1.5">{label}<SortIcon col={key} /></div>
                    </th>
                  ))}
                  <th className="py-3 px-4 font-medium text-text-muted">Estado</th>
                  <th
                    onClick={() => handleSort('projects')}
                    className="py-3 px-4 font-medium text-text-muted cursor-pointer hover:text-text-base transition-theme select-none"
                  >
                    <div className="flex items-center gap-1.5">Projectos<SortIcon col="projects" /></div>
                  </th>
                  <th className="py-3 px-4 font-medium text-text-muted text-right">Acções</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-text-muted">
                      Nenhum utilizador encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const sc = STATUS_CFG[user.status]
                    return (
                      <tr key={user.id} className="border-b border-border hover:bg-surface-hover transition-theme last:border-0">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} department={user.department} />
                            <div>
                              <p className="font-medium text-text-base">{user.name}</p>
                              <p className="text-xs text-text-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-muted">{user.role}</td>
                        <td className="py-3 px-4 text-text-muted">{user.department}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                            {sc.icon}{sc.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-muted">{user.projects}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/styleguide/examples/users/${user.id}`)}
                              title="Editar"
                              className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-theme"
                              style={{ '--tw-bg-opacity': '1' } as React.CSSProperties}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(user)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-theme"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-text-muted mt-3 px-1">
            {filtered.length} de {users.length} utilizadores
          </p>
        )}
      </div>
    </>
  )
}

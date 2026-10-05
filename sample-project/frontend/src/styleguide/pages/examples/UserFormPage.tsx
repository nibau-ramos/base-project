import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X, Loader2, AlertTriangle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { addUser, updateUser, deleteUser, type UserStatus } from '../../../store/usersSlice'

/* ── Field components ────────────────────────────────────────────────────── */

function InputField({
  label, id, type = 'text', value, onChange, error, required, placeholder,
}: {
  label: string; id: string; type?: string; value: string; onChange: (v: string) => void
  error?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-base">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-bg text-text-base
          placeholder:text-text-muted outline-none transition-theme
          focus:ring-2 focus:border-primary
          ${error ? 'border-red-400 focus:ring-red-100' : 'border-border focus:ring-primary/10'}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function SelectField({
  label, id, value, onChange, options, error, required,
}: {
  label: string; id: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; error?: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-base">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-bg text-text-base cursor-pointer
          outline-none transition-theme focus:ring-2 focus:border-primary
          ${error ? 'border-red-400 focus:ring-red-100' : 'border-border focus:ring-primary/10'}`}
      >
        <option value="">Seleccionar...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

/* ── Delete confirmation modal ───────────────────────────────────────────── */

function DeleteModal({ name, onCancel, onConfirm }: {
  name: string; onCancel: () => void; onConfirm: () => void
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
            Tens a certeza que pretendes eliminar <strong className="text-text-base">{name}</strong>?
            Esta acção é <strong className="text-text-base">permanente e irreversível</strong>.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
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

/* ── Form fields type ────────────────────────────────────────────────────── */

interface FormFields {
  name: string
  email: string
  role: string
  department: string
  status: UserStatus
  projects: string
}

const EMPTY: FormFields = { name: '', email: '', role: '', department: '', status: 'pending', projects: '0' }

const DEPARTMENTS = ['Design', 'Tecnologia', 'Estratégia', 'Marketing', 'Operações', 'Gestão'].map(
  (d) => ({ value: d, label: d })
)
const STATUSES: { value: UserStatus; label: string }[] = [
  { value: 'active',   label: 'Activo' },
  { value: 'pending',  label: 'Pendente' },
  { value: 'inactive', label: 'Inactivo' },
]

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function UserFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = id !== undefined
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) => s.users.list)

  const editUser = isEdit ? users.find((u) => u.id === Number(id)) ?? null : null

  const [fields, setFields] = useState<FormFields>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormFields>>({})
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (editUser) {
      setFields({
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        department: editUser.department,
        status: editUser.status,
        projects: String(editUser.projects),
      })
    } else {
      setFields(EMPTY)
    }
  }, [editUser?.id])

  function set(key: keyof FormFields, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate(): Partial<FormFields> {
    const e: Partial<FormFields> = {}
    if (!fields.name.trim()) e.name = 'Nome obrigatório'
    if (!fields.email.trim()) e.email = 'Email obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Email inválido'
    if (!fields.role.trim()) e.role = 'Cargo obrigatório'
    if (!fields.department) e.department = 'Departamento obrigatório'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))

    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      role: fields.role.trim(),
      department: fields.department,
      status: fields.status,
      projects: Math.max(0, Number(fields.projects) || 0),
    }

    if (isEdit && editUser) {
      dispatch(updateUser({ ...editUser, ...payload }))
    } else {
      dispatch(addUser(payload))
    }
    navigate('/styleguide/examples/users')
  }

  function handleDelete() {
    if (editUser) dispatch(deleteUser(editUser.id))
    navigate('/styleguide/examples/users')
  }

  // User not found
  if (isEdit && !editUser) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-text-muted text-sm">Utilizador não encontrado.</p>
        <button
          onClick={() => navigate('/styleguide/examples/users')}
          className="text-sm font-medium transition-theme"
          style={{ color: 'var(--color-primary)' }}
        >
          ← Voltar à lista
        </button>
      </div>
    )
  }

  return (
    <>
      {showDelete && editUser && (
        <DeleteModal
          name={editUser.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}

      <div>
        {/* Back link */}
        <button
          onClick={() => navigate('/styleguide/examples/users')}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base mb-6 transition-theme"
        >
          <ArrowLeft size={14} /> Utilizadores
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-base">
            {isEdit ? `Editar ${editUser?.name}` : 'Novo utilizador'}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {isEdit ? 'Actualiza os dados do utilizador.' : 'Preenche os dados para criar um novo membro da equipa.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-2xl">

          {/* Personal info */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-base">Informação pessoal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nome completo" id="name" required
                value={fields.name} onChange={(v) => set('name', v)} error={errors.name}
              />
              <InputField
                label="Email" id="email" type="email" required
                value={fields.email} onChange={(v) => set('email', v)} error={errors.email}
              />
              <InputField
                label="Cargo" id="role" required placeholder="ex: Design Lead"
                value={fields.role} onChange={(v) => set('role', v)} error={errors.role}
              />
              <SelectField
                label="Departamento" id="department" required
                options={DEPARTMENTS}
                value={fields.department} onChange={(v) => set('department', v)} error={errors.department}
              />
            </div>
          </div>

          {/* Account settings */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-base">Configuração de conta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-base">Estado</label>
                <div className="flex gap-3 flex-wrap">
                  {STATUSES.map((s) => (
                    <label
                      key={s.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-theme
                        ${fields.status === s.value
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-border text-text-muted hover:bg-surface-hover'}`}
                      style={fields.status === s.value ? { borderColor: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)', color: 'var(--color-primary)' } : {}}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s.value}
                        checked={fields.status === s.value}
                        onChange={() => set('status', s.value)}
                        className="sr-only"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
              <InputField
                label="Projectos atribuídos" id="projects" type="number"
                value={fields.projects} onChange={(v) => set('projects', v)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white
                disabled:opacity-60 transition-theme"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'A guardar...' : isEdit ? 'Guardar alterações' : 'Criar utilizador'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/styleguide/examples/users')}
              className="px-5 py-2.5 text-sm font-medium rounded-xl border border-border text-text-muted hover:bg-surface-hover transition-theme"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Danger zone — edit only */}
        {isEdit && (
          <div className="mt-8 max-w-2xl">
            <div className="rounded-xl border border-red-200 dark:border-red-900 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Zona de perigo</h2>
                  <p className="text-sm text-text-muted mt-1">
                    Ao eliminar este utilizador, todos os seus dados serão removidos permanentemente.
                  </p>
                </div>
                <button
                  onClick={() => setShowDelete(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-red-300 text-red-600
                    hover:bg-red-50 dark:hover:bg-red-950/30 transition-theme flex-shrink-0"
                >
                  Eliminar utilizador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

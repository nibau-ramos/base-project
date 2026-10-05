import { AlertTriangle, ArrowLeft, Mail, RotateCcw } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../../lib/api'
import { hasMfa, ROLE_LABELS, useCurrentUser, type Role, type User } from '../../lib/auth'
import { formatDate } from '../../lib/dates'
import { Button } from '../../ui/Button'
import { Alert, Badge, Spinner } from '../../ui/feedback'
import { ChoiceGroup, PasswordField, TextField, Toggle } from '../../ui/form'
import { Card, PageHeader } from '../../ui/layout'
import { assignableRoles, MfaStatus } from './Users'
import { DeleteUserModal, ResetMfaModal, WelcomeModal } from './userModals'

const ROLE_HINTS: Record<Role, string> = {
  super_admin: 'Acesso total, incluindo gerir outros super administradores.',
  admin: 'Gere utilizadores e settings da plataforma.',
  normal: 'Acede ao back-office e ao seu perfil.',
}

interface Fields {
  email: string
  name: string
  role: Role
  active: boolean
  mfaRequired: boolean
  password: string
}

export default function UserForm() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const me = useCurrentUser()
  const navigate = useNavigate()
  const roles = assignableRoles(me.role)

  const [user, setUser] = useState<User | null>(null)
  const [fields, setFields] = useState<Fields>({
    email: '',
    name: '',
    role: 'normal',
    active: true,
    mfaRequired: false,
    password: '',
  })
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<'welcome' | 'delete' | 'reset-mfa' | null>(null)

  useEffect(() => {
    if (!isEdit) return
    api<{ user: User }>(`/users/${id}`)
      .then(({ user }) => {
        setUser(user)
        setFields({
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          mfaRequired: user.mfaRequired,
          password: '',
        })
      })
      .catch((err) => setLoadError(errorMessage(err)))
  }, [id, isEdit])

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => setFields((f) => ({ ...f, [key]: value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      if (isEdit) {
        const { user: saved } = await api<{ user: User }>(`/users/${id}`, {
          method: 'PUT',
          body: { name: fields.name, role: fields.role, active: fields.active, mfaRequired: fields.mfaRequired },
        })
        setUser(saved)
        setMessage('Alterações guardadas.')
      } else {
        const { user: created } = await api<{ user: User }>('/users', {
          method: 'POST',
          body: {
            email: fields.email,
            name: fields.name,
            role: fields.role,
            password: fields.password,
            mfaRequired: fields.mfaRequired,
          },
        })
        navigate(`/admin/users/${created.id}`, { replace: true })
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const back = (
    <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-base mb-6 transition-theme">
      <ArrowLeft size={14} /> Utilizadores
    </Link>
  )

  if (isEdit && !user) return loadError ? <>{back}<Alert>{loadError}</Alert></> : <Spinner />

  const isSelf = user?.id === me.id

  return (
    <>
      {modal === 'welcome' && user && (
        <WelcomeModal
          user={user}
          onClose={() => setModal(null)}
          onSent={(msg) => {
            setModal(null)
            setMessage(msg)
          }}
        />
      )}
      {modal === 'delete' && user && (
        <DeleteUserModal user={user} onClose={() => setModal(null)} onDeleted={() => navigate('/admin/users', { replace: true })} />
      )}
      {modal === 'reset-mfa' && user && (
        <ResetMfaModal
          user={user}
          onClose={() => setModal(null)}
          onReset={(updated, msg) => {
            setModal(null)
            setUser(updated)
            setMessage(msg)
          }}
        />
      )}

      {back}
      <PageHeader
        title={isEdit ? `Editar ${user?.name || user?.email}` : 'Novo utilizador'}
        description={isEdit ? 'Atualiza os dados e o perfil do utilizador.' : 'Preenche os dados para criar uma nova conta.'}
        actions={
          isEdit && (
            <Button variant="subtle" icon={<Mail size={15} />} onClick={() => setModal('welcome')}>
              E-mail de boas-vindas
            </Button>
          )
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <Alert>{error}</Alert>
        {message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}

        <Card title="Informação pessoal">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Nome" value={fields.name} onChange={(v) => set('name', v)} autoComplete="off" />
            <TextField
              label="E-mail"
              type="email"
              value={fields.email}
              onChange={(v) => set('email', v)}
              required={!isEdit}
              disabled={isEdit}
              hint={isEdit ? 'O e-mail é o identificador de login e não pode ser alterado.' : 'Será o identificador de login.'}
              autoComplete="off"
            />
          </div>
        </Card>

        <Card title="Conta">
          <div className="space-y-5">
            {isSelf ? (
              <p className="text-sm text-text-muted">
                Perfil: <Badge variant="primary">{ROLE_LABELS[fields.role]}</Badge>
                <span className="block text-xs mt-2">Não podes alterar o teu próprio perfil nem desativar a tua conta.</span>
              </p>
            ) : (
              <>
                <ChoiceGroup
                  label="Perfil"
                  value={fields.role}
                  onChange={(v) => set('role', v)}
                  options={roles.map((r) => ({ value: r, label: ROLE_LABELS[r], description: ROLE_HINTS[r] }))}
                />
                <p className="text-xs text-text-muted -mt-3">{ROLE_HINTS[fields.role]}</p>
              </>
            )}

            {isEdit && !isSelf && (
              <Toggle
                label="Conta ativa"
                description="Contas inativas não conseguem entrar nem recuperar a password."
                checked={fields.active}
                onChange={(v) => set('active', v)}
              />
            )}

            {!isEdit && (
              <PasswordField
                label="Password inicial"
                value={fields.password}
                onChange={(v) => set('password', v)}
                autoComplete="new-password"
                minLength={8}
                hint="Opcional. Se ficar vazia, envia depois o e-mail de boas-vindas com o link para definir password."
              />
            )}

            {isEdit && user && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
                <div>
                  <dt className="text-xs text-text-muted">Criado em</dt>
                  <dd className="font-medium text-text-base mt-0.5">{formatDate(user.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted">Último acesso</dt>
                  <dd className="font-medium text-text-base mt-0.5">{formatDate(user.lastLoginAt, 'datetime') || '—'}</dd>
                </div>
              </dl>
            )}
          </div>
        </Card>

        <Card
          title="Verificação em dois passos (MFA)"
          description="Impressão digital (Touch ID, Windows Hello) ou código de uma aplicação autenticadora."
          actions={user && <MfaStatus user={user} />}
        >
          <div className="space-y-4">
            {isSelf ? (
              <p className="text-sm text-text-muted">
                A tua verificação em dois passos gere-se em{' '}
                <Link to="/admin/profile" className="text-primary font-medium hover:underline">O meu perfil</Link>.
              </p>
            ) : (
              <Toggle
                label="Exigir verificação em dois passos"
                description={
                  fields.mfaRequired
                    ? 'A pessoa tem de manter a impressão digital ou a aplicação autenticadora (pelo menos uma). Se ainda não tiver nenhuma, escolhe e configura uma no próximo login (as sessões abertas terminam).'
                    : 'Quando ativo, a pessoa é obrigada a ter impressão digital ou aplicação autenticadora e não pode ficar sem nenhuma.'
                }
                checked={fields.mfaRequired}
                onChange={(v) => set('mfaRequired', v)}
              />
            )}
            {isEdit && user && !isSelf && hasMfa(user) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
                <p className="text-sm text-text-muted">
                  Perdeu o telemóvel ou o computador? Repor remove a aplicação e as impressões digitais registadas e termina as
                  sessões abertas.
                  {user.mfaRequired && ' Como é obrigatória, volta a configurá-la no próximo login.'}
                </p>
                <Button type="button" variant="destructive-outline" size="sm" icon={<RotateCcw size={13} />} onClick={() => setModal('reset-mfa')}>
                  Repor MFA
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving}>
            {saving ? 'A guardar...' : isEdit ? 'Guardar alterações' : 'Criar utilizador'}
          </Button>
          <Button type="button" variant="subtle" onClick={() => navigate('/admin/users')}>
            Cancelar
          </Button>
        </div>
      </form>

      {isEdit && !isSelf && (
        <div className="mt-8 max-w-2xl rounded-xl border border-red-200 dark:border-red-900 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Zona de perigo</h2>
              <p className="text-sm text-text-muted mt-1">Ao eliminar este utilizador, a conta é removida permanentemente.</p>
            </div>
            <Button variant="destructive-outline" onClick={() => setModal('delete')}>
              Eliminar utilizador
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

import { Fingerprint, KeyRound, Laptop, Lock, ShieldCheck, ShieldOff, Smartphone, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import TotpSetupForm from '../../components/TotpSetupForm'
import { api, errorMessage } from '../../lib/api'
import { hasMfa, ROLE_LABELS, useAuth, useCurrentUser, type User } from '../../lib/auth'
import { formatDate } from '../../lib/dates'
import { defaultDeviceName, fingerprintSupported, registerFingerprint } from '../../lib/webauthn'
import { Button, IconButton } from '../../ui/Button'
import { Alert, Badge } from '../../ui/feedback'
import { PasswordField, TextField } from '../../ui/form'
import { Avatar, Card, Modal, PageHeader } from '../../ui/layout'

function ChangePassword() {
  const empty = { currentPassword: '', newPassword: '', confirmPassword: '' }
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key: keyof typeof empty) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (form.newPassword !== form.confirmPassword) return setError('A confirmação não coincide com a nova password.')
    setBusy(true)
    try {
      setMessage((await api<{ message: string }>('/profile/password', { method: 'PUT', body: form })).message)
      setForm(empty)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card title="Alterar password" description="As outras sessões abertas são terminadas.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert>{error}</Alert>
        {message && <Alert type="success">{message}</Alert>}
        <PasswordField label="Password atual" value={form.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" required />
        <PasswordField
          label="Nova password"
          value={form.newPassword}
          onChange={set('newPassword')}
          autoComplete="new-password"
          minLength={8}
          hint="Mínimo de 8 caracteres."
          required
        />
        <PasswordField label="Confirmar nova password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" required />
        <div className="flex justify-end">
          <Button type="submit" loading={busy} icon={<KeyRound size={15} />}>
            Alterar password
          </Button>
        </div>
      </form>
    </Card>
  )
}

interface Passkey {
  id: number
  name: string
  deviceType: string | null
  backedUp: boolean
  createdAt: string
  lastUsedAt: string | null
}

function useRunner() {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function run(fn: () => Promise<string | void>) {
    setError('')
    setMessage('')
    setBusy(true)
    try {
      setMessage((await fn()) || '')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }
  return { error, message, busy, run }
}

/** True when removing one factor would leave a mandatory-MFA account with none. */
const isLastFactor = (user: User, kind: 'totp' | 'passkey') =>
  user.mfaRequired && (kind === 'totp' ? user.passkeyCount === 0 : !user.otpEnabled && user.passkeyCount <= 1)

const LAST_FACTOR_HINT = 'É o único método ativo e a verificação em dois passos é obrigatória nesta conta. Adiciona outro método para poderes remover este.'

function TotpSection() {
  const user = useCurrentUser()
  const { setUser } = useAuth()
  const { error, message, busy, run } = useRunner()
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null)
  const [password, setPassword] = useState('')
  const locked = isLastFactor(user, 'totp')

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0"><Smartphone size={16} /></span>
          <div>
            <h3 className="text-sm font-semibold text-text-base">Aplicação autenticadora</h3>
            <p className="text-xs text-text-muted mt-0.5">Código de 6 dígitos gerado no telemóvel.</p>
          </div>
        </div>
        {user.otpEnabled ? <Badge variant="success" icon={<ShieldCheck size={12} />}>Ativa</Badge> : <Badge>Inativa</Badge>}
      </div>
      <Alert>{error}</Alert>
      {message && <Alert type="success">{message}</Alert>}

      {user.otpEnabled ? (
        locked ? (
          <p className="text-xs text-text-muted flex items-start gap-1.5"><Lock size={12} className="mt-0.5 flex-shrink-0" /> {LAST_FACTOR_HINT}</p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              run(async () => {
                setUser((await api<{ user: User }>('/profile/otp/disable', { method: 'POST', body: { password } })).user)
                setPassword('')
                return 'Aplicação autenticadora desativada.'
              })
            }}
          >
            <PasswordField label="Confirma a tua password para desativar" value={password} onChange={setPassword} autoComplete="current-password" required />
            <div className="flex justify-end">
              <Button type="submit" size="sm" variant="destructive-outline" loading={busy} icon={<ShieldOff size={13} />}>
                Desativar
              </Button>
            </div>
          </form>
        )
      ) : setup ? (
        <TotpSetupForm
          qr={setup.qr}
          secret={setup.secret}
          onConfirm={(code) =>
            run(async () => {
              setUser((await api<{ user: User }>('/profile/otp/confirm', { method: 'POST', body: { code } })).user)
              setSetup(null)
              return 'Aplicação autenticadora ativada.'
            })
          }
        >
          <div className="flex justify-end gap-2">
            <Button type="button" variant="subtle" size="sm" onClick={() => setSetup(null)}>Cancelar</Button>
            <Button type="submit" size="sm" loading={busy}>Confirmar e ativar</Button>
          </div>
        </TotpSetupForm>
      ) : (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            loading={busy}
            icon={<Smartphone size={13} />}
            onClick={() => run(async () => setSetup(await api<{ qr: string; secret: string }>('/profile/otp/setup', { method: 'POST' })))}
          >
            Ativar aplicação
          </Button>
        </div>
      )}
    </section>
  )
}

function FingerprintSection() {
  const user = useCurrentUser()
  const { setUser } = useAuth()
  const { error, message, busy, run } = useRunner()
  const [passkeys, setPasskeys] = useState<Passkey[] | null>(null)
  const [name, setName] = useState(defaultDeviceName())
  const [removing, setRemoving] = useState<Passkey | null>(null)
  const supported = fingerprintSupported()
  const locked = isLastFactor(user, 'passkey')

  useEffect(() => {
    api<{ passkeys: Passkey[] }>('/profile/passkeys').then((d) => setPasskeys(d.passkeys))
  }, [])

  const apply = (d: { user: User; passkeys: Passkey[] }) => {
    setUser(d.user)
    setPasskeys(d.passkeys)
  }

  return (
    <section className="space-y-4">
      {removing && (
        <Modal
          title="Remover impressão digital"
          onClose={() => setRemoving(null)}
          footer={
            <>
              <Button variant="subtle" onClick={() => setRemoving(null)}>Cancelar</Button>
              <Button
                variant="destructive"
                loading={busy}
                icon={<Trash2 size={15} />}
                onClick={() =>
                  run(async () => {
                    apply(await api<{ user: User; passkeys: Passkey[] }>(`/profile/passkeys/${removing.id}`, { method: 'DELETE' }))
                    setRemoving(null)
                    return 'Impressão digital removida.'
                  })
                }
              >
                Remover
              </Button>
            </>
          }
        >
          <p className="text-sm text-text-muted">
            Deixas de poder entrar com a impressão digital de <strong className="text-text-base">{removing.name}</strong>.
          </p>
        </Modal>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0"><Fingerprint size={16} /></span>
          <div>
            <h3 className="text-sm font-semibold text-text-base">Impressão digital</h3>
            <p className="text-xs text-text-muted mt-0.5">Touch ID, Windows Hello ou o sensor do computador.</p>
          </div>
        </div>
        {user.passkeyCount > 0 ? (
          <Badge variant="success" icon={<ShieldCheck size={12} />}>{user.passkeyCount === 1 ? '1 dispositivo' : `${user.passkeyCount} dispositivos`}</Badge>
        ) : (
          <Badge>Inativa</Badge>
        )}
      </div>
      <Alert>{error}</Alert>
      {message && <Alert type="success">{message}</Alert>}

      {passkeys && passkeys.length > 0 && (
        <ul className="rounded-xl border border-border divide-y divide-border bg-bg">
          {passkeys.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-3 py-2.5">
              <Laptop size={16} className="text-text-muted flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-base truncate">
                  {p.name}
                  {p.backedUp && <span className="ml-2 text-xs font-normal text-text-muted">sincronizada</span>}
                </p>
                <p className="text-xs text-text-muted">
                  Registada em {formatDate(p.createdAt)} · {p.lastUsedAt ? `último uso ${formatDate(p.lastUsedAt, 'datetime')}` : 'ainda não usada'}
                </p>
              </div>
              <IconButton
                label={locked ? LAST_FACTOR_HINT : 'Remover'}
                tone="danger"
                disabled={locked}
                className="disabled:opacity-40 disabled:pointer-events-none"
                onClick={() => setRemoving(p)}
              >
                <Trash2 size={15} />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      {locked && <p className="text-xs text-text-muted flex items-start gap-1.5"><Lock size={12} className="mt-0.5 flex-shrink-0" /> {LAST_FACTOR_HINT}</p>}

      {supported ? (
        <form
          className="flex flex-col sm:flex-row sm:items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            run(async () => {
              apply(await registerFingerprint<{ user: User; passkeys: Passkey[] }>('/profile/passkeys', name))
              return 'Impressão digital registada. Já a podes usar no login.'
            })
          }}
        >
          <div className="flex-1">
            <TextField label="Nome deste computador" value={name} onChange={setName} maxLength={60} required />
          </div>
          <Button type="submit" size="md" variant="outline" loading={busy} icon={<Fingerprint size={15} />}>
            Registar este computador
          </Button>
        </form>
      ) : (
        <Alert type="info">Este browser não suporta impressão digital (WebAuthn).</Alert>
      )}
    </section>
  )
}

function Mfa() {
  const user = useCurrentUser()
  return (
    <Card
      title="Verificação em dois passos"
      description="Além da password, pede a impressão digital ou um código da aplicação a cada login."
      actions={
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {user.mfaRequired && <Badge variant="primary" icon={<Lock size={12} />}>Obrigatória</Badge>}
          {hasMfa(user) ? <Badge variant="success" icon={<ShieldCheck size={12} />}>Ativa</Badge> : <Badge variant="warning">Inativa</Badge>}
        </div>
      }
    >
      <div className="space-y-6">
        {user.mfaRequired && (
          <Alert type="info" title="Obrigatória nesta conta">
            Um administrador definiu que esta conta tem de usar verificação em dois passos. Podes usar a impressão digital,
            a aplicação autenticadora ou ambas, mas tens de manter pelo menos uma.
          </Alert>
        )}
        <FingerprintSection />
        <div className="border-t border-border" />
        <TotpSection />
      </div>
    </Card>
  )
}

export default function Profile() {
  const user = useCurrentUser()
  return (
    <>
      <PageHeader title="O meu perfil" description="Gere a tua password e a verificação em dois passos." />
      <div className="rounded-xl border border-border bg-surface p-5 mb-5 flex items-center gap-4 min-w-0">
        <div className="scale-125 origin-left">
          <Avatar name={user.name} email={user.email} />
        </div>
        <div className="min-w-0 ml-2">
          <p className="font-semibold text-text-base truncate">{user.name || user.email}</p>
          <p className="text-sm text-text-muted truncate">{user.email}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <ChangePassword />
        <Mfa />
      </div>
    </>
  )
}

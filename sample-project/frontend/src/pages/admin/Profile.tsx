import { KeyRound, Lock, ShieldCheck, ShieldOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { api, errorMessage } from '../../lib/api'
import { ROLE_LABELS, useAuth, useCurrentUser, type User } from '../../lib/auth'
import { Button } from '../../ui/Button'
import { Alert, Badge } from '../../ui/feedback'
import { PasswordField, TextField } from '../../ui/form'
import { Avatar, Card, PageHeader } from '../../ui/layout'

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

function Otp() {
  const user = useCurrentUser()
  const { setUser } = useAuth()
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(fn: () => Promise<void>) {
    setError('')
    setMessage('')
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const status = (
    <div className="flex items-center gap-1.5 flex-wrap justify-end">
      {user.otpRequired && <Badge variant="primary" icon={<Lock size={12} />}>Obrigatório</Badge>}
      {user.otpEnabled ? (
        <Badge variant="success" icon={<ShieldCheck size={12} />}>Ativo</Badge>
      ) : (
        <Badge variant="warning">Inativo</Badge>
      )}
    </div>
  )

  return (
    <Card title="Verificação em dois passos (OTP)" description="Um código da aplicação autenticadora a cada login." actions={status}>
      <div className="space-y-4">
        <Alert>{error}</Alert>
        {message && <Alert type="success">{message}</Alert>}

        {user.otpEnabled && user.otpRequired ? (
          <Alert type="info" title="OTP obrigatório">
            Um administrador definiu que esta conta tem de usar verificação em dois passos, por isso não pode ser
            desativada. Se perderes o acesso à aplicação autenticadora, pede a um administrador para repor o teu OTP.
          </Alert>
        ) : user.otpEnabled ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              run(async () => {
                setUser((await api<{ user: User }>('/profile/otp/disable', { method: 'POST', body: { password } })).user)
                setPassword('')
                setMessage('OTP desativado.')
              })
            }}
          >
            <PasswordField
              label="Confirma a tua password para desativar"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" variant="destructive-outline" loading={busy} icon={<ShieldOff size={15} />}>
                Desativar OTP
              </Button>
            </div>
          </form>
        ) : setup ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              run(async () => {
                setUser((await api<{ user: User }>('/profile/otp/confirm', { method: 'POST', body: { code } })).user)
                setSetup(null)
                setCode('')
                setMessage('OTP ativado. A partir de agora, será pedido um código ao entrar.')
              })
            }}
          >
            <p className="text-sm text-text-muted">
              Lê o código QR com uma aplicação autenticadora (Google Authenticator, Microsoft Authenticator, 1Password…) e
              introduz o código gerado para confirmar.
            </p>
            <div className="flex flex-col items-center gap-2">
              <img src={setup.qr} alt="Código QR para configurar o OTP" className="w-48 h-48 rounded-xl border border-border bg-white p-2" />
              <p className="text-xs text-text-muted text-center break-all">
                Chave manual: <code className="font-mono text-text-base">{setup.secret}</code>
              </p>
            </div>
            <TextField
              label="Código"
              value={code}
              onChange={setCode}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={7}
              required
              className="tracking-[0.4em] text-center font-mono text-base"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="subtle" onClick={() => setSetup(null)}>Cancelar</Button>
              <Button type="submit" loading={busy}>Confirmar e ativar</Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-text-muted">Protege a tua conta com um código adicional gerado no telemóvel.</p>
            <Button
              loading={busy}
              icon={<ShieldCheck size={15} />}
              onClick={() => run(async () => setSetup(await api<{ qr: string; secret: string }>('/profile/otp/setup', { method: 'POST' })))}
            >
              Ativar OTP
            </Button>
          </div>
        )}
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
        <Otp />
      </div>
    </>
  )
}

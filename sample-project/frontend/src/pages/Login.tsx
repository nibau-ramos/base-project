import { ArrowLeft, ChevronRight, Fingerprint, ShieldCheck, Smartphone } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TotpSetupForm from '../components/TotpSetupForm'
import { api, errorMessage } from '../lib/api'
import { useAuth, type User } from '../lib/auth'
import { authenticateFingerprint, defaultDeviceName, fingerprintSupported, registerFingerprint } from '../lib/webauthn'
import { Button } from '../ui/Button'
import { Alert } from '../ui/feedback'
import { PasswordField, TextField } from '../ui/form'

type Step =
  | { kind: 'credentials' }
  /** Second step with the factors the account already has. */
  | { kind: 'mfa'; totp: boolean; passkey: boolean }
  /** MFA is mandatory and nothing is set up yet: choose a method. */
  | { kind: 'setup' }
  | { kind: 'setup-totp'; qr: string; secret: string }

interface LoginResponse {
  user?: User
  mfaRequired?: boolean
  methods?: { totp: boolean; passkey: boolean }
  mfaSetupRequired?: boolean
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <span className="h-px flex-1 bg-border" />
      ou
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function MethodButton({ icon, title, text, onClick, disabled }: { icon: ReactNode; title: string; text: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-bg text-left hover:border-primary/40 hover:bg-surface-hover transition-theme disabled:opacity-50"
    >
      <span className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-text-base">{title}</span>
        <span className="block text-xs text-text-muted mt-0.5">{text}</span>
      </span>
      <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
    </button>
  )
}

export default function Login() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState<Step>({ kind: 'credentials' })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const canUseFingerprint = fingerprintSupported()

  const from: string | undefined = location.state?.from
  const target = from?.startsWith('/admin') ? from : '/admin'
  if (user) return <Navigate to={target} replace />

  async function run(fn: () => Promise<void>) {
    setError('')
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  function done(data: { user?: User }) {
    setUser(data.user!)
    navigate(target, { replace: true })
  }

  const login = () =>
    run(async () => {
      const data = await api<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } })
      if (data.mfaRequired) return setStep({ kind: 'mfa', ...data.methods! })
      if (data.mfaSetupRequired) return setStep({ kind: 'setup' })
      done(data)
    })

  const back = (
    <button
      onClick={() => {
        setStep({ kind: 'credentials' })
        setCode('')
        setError('')
      }}
      className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme"
    >
      <ArrowLeft size={13} /> Voltar
    </button>
  )

  /* ── Second step ─────────────────────────────────────────────── */
  if (step.kind === 'mfa') {
    const fingerprint = step.passkey && canUseFingerprint
    return (
      <AuthLayout
        title="Verificação em dois passos"
        subtitle={fingerprint && step.totp ? 'Usa a impressão digital ou o código da aplicação autenticadora.' : fingerprint ? 'Confirma com a impressão digital deste computador.' : 'Introduz o código de 6 dígitos da tua aplicação autenticadora.'}
      >
        <div className="space-y-4">
          <Alert>{error}</Alert>
          {fingerprint && (
            <Button
              block
              size="lg"
              loading={busy}
              icon={<Fingerprint size={18} />}
              onClick={() => run(async () => done(await authenticateFingerprint<{ user: User }>('/auth/passkey')))}
            >
              Usar impressão digital
            </Button>
          )}
          {fingerprint && step.totp && <Divider />}
          {step.totp && (
            <form
              className="space-y-4"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
                run(async () => done(await api<{ user: User }>('/auth/otp', { method: 'POST', body: { code } })))
              }}
            >
              <TextField
                label="Código da aplicação"
                value={code}
                onChange={setCode}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={7}
                autoFocus={!fingerprint}
                required
                className="tracking-[0.4em] text-center font-mono text-base"
              />
              <Button type="submit" block variant={fingerprint ? 'outline' : 'primary'} loading={busy} icon={<ShieldCheck size={15} />}>
                Verificar código
              </Button>
            </form>
          )}
          {step.passkey && !canUseFingerprint && !step.totp && (
            <Alert type="warning">
              Esta conta usa impressão digital, mas este browser não a suporta. Entra a partir de um computador onde a
              registaste, ou pede a um administrador para repor a verificação em dois passos.
            </Alert>
          )}
        </div>
        {back}
      </AuthLayout>
    )
  }

  /* ── Mandatory setup: choose a method ────────────────────────── */
  if (step.kind === 'setup') {
    return (
      <AuthLayout title="Ativa a verificação em dois passos" subtitle="Esta conta exige um segundo fator. Escolhe um método para continuar.">
        <div className="space-y-3">
          <Alert>{error}</Alert>
          {canUseFingerprint && (
            <MethodButton
              icon={<Fingerprint size={18} />}
              title="Impressão digital neste computador"
              text="Touch ID, Windows Hello ou o sensor do teu dispositivo."
              disabled={busy}
              onClick={() =>
                run(async () => done(await registerFingerprint<{ user: User }>('/auth/mfa/setup/passkey', defaultDeviceName())))
              }
            />
          )}
          <MethodButton
            icon={<Smartphone size={18} />}
            title="Aplicação autenticadora"
            text="Código de 6 dígitos gerado no telemóvel."
            disabled={busy}
            onClick={() =>
              run(async () => {
                const setup = await api<{ qr: string; secret: string }>('/auth/mfa/setup/totp', { method: 'POST' })
                setStep({ kind: 'setup-totp', ...setup })
              })
            }
          />
          <p className="text-xs text-text-muted pt-1">Depois de entrar, podes adicionar o outro método no teu perfil.</p>
        </div>
        {back}
      </AuthLayout>
    )
  }

  if (step.kind === 'setup-totp') {
    return (
      <AuthLayout title="Aplicação autenticadora" subtitle="Esta conta exige um segundo fator.">
        <div className="space-y-4">
          <Alert>{error}</Alert>
          <TotpSetupForm
            qr={step.qr}
            secret={step.secret}
            onConfirm={(c) =>
              run(async () => done(await api<{ user: User }>('/auth/mfa/setup/totp/confirm', { method: 'POST', body: { code: c } })))
            }
          >
            <Button type="submit" block loading={busy} icon={<ShieldCheck size={15} />}>
              Ativar e entrar
            </Button>
          </TotpSetupForm>
        </div>
        <button
          onClick={() => setStep({ kind: 'setup' })}
          className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme"
        >
          <ArrowLeft size={13} /> Escolher outro método
        </button>
      </AuthLayout>
    )
  }

  /* ── E-mail + password ───────────────────────────────────────── */
  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Inicia sessão no back-office.">
      <form
        className="space-y-4"
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          login()
        }}
      >
        <Alert>{error}</Alert>
        <TextField label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" autoFocus required />
        <PasswordField label="Password" value={password} onChange={setPassword} autoComplete="current-password" required />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Esqueceste a password?
          </Link>
        </div>
        <Button type="submit" block loading={busy}>
          {busy ? 'A entrar...' : 'Iniciar sessão'}
        </Button>
      </form>
    </AuthLayout>
  )
}

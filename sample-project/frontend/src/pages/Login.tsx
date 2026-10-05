import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api, errorMessage } from '../lib/api'
import { useAuth, type User } from '../lib/auth'
import { Button } from '../ui/Button'
import { Alert } from '../ui/feedback'
import { PasswordField, TextField } from '../ui/form'

export default function Login() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // 'otp-setup' = an admin made OTP mandatory and this account hasn't set it up yet
  const [step, setStep] = useState<'credentials' | 'otp' | 'otp-setup'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const from: string | undefined = location.state?.from
  const target = from?.startsWith('/admin') ? from : '/admin'
  if (user) return <Navigate to={target} replace />

  async function submit(path: string, body: object) {
    setError('')
    setBusy(true)
    try {
      const data = await api<{ otpRequired?: boolean; otpSetupRequired?: boolean; user?: User }>(path, { method: 'POST', body })
      if (data.otpRequired) {
        setStep('otp')
        return
      }
      if (data.otpSetupRequired) {
        setSetup(await api<{ qr: string; secret: string }>('/auth/otp/setup', { method: 'POST' }))
        setStep('otp-setup')
        return
      }
      setUser(data.user!)
      navigate(target, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const backToCredentials = (
    <button
      onClick={() => {
        setStep('credentials')
        setCode('')
        setSetup(null)
        setError('')
      }}
      className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme"
    >
      <ArrowLeft size={13} /> Voltar
    </button>
  )

  if (step === 'otp-setup' && setup) {
    return (
      <AuthLayout
        title="Ativa a verificação em dois passos"
        subtitle="Esta conta exige OTP. Configura-o agora para continuar."
      >
        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            submit('/auth/otp/setup/confirm', { code })
          }}
        >
          <Alert>{error}</Alert>
          <ol className="text-sm text-text-muted space-y-1 list-decimal pl-4">
            <li>Abre uma aplicação autenticadora (Google Authenticator, Microsoft Authenticator, 1Password…).</li>
            <li>Lê o código QR abaixo.</li>
            <li>Introduz o código de 6 dígitos que a aplicação mostrar.</li>
          </ol>
          <div className="flex flex-col items-center gap-2">
            <img src={setup.qr} alt="Código QR para configurar o OTP" className="w-44 h-44 rounded-xl border border-border bg-white p-2" />
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
          <Button type="submit" block loading={busy} icon={<ShieldCheck size={15} />}>
            {busy ? 'A verificar...' : 'Ativar e entrar'}
          </Button>
        </form>
        {backToCredentials}
      </AuthLayout>
    )
  }

  if (step === 'otp') {
    return (
      <AuthLayout title="Verificação em dois passos" subtitle="Introduz o código de 6 dígitos da tua aplicação autenticadora.">
        <form
          className="space-y-4"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            submit('/auth/otp', { code })
          }}
        >
          <Alert>{error}</Alert>
          <TextField
            label="Código"
            value={code}
            onChange={setCode}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            autoFocus
            required
            className="tracking-[0.4em] text-center font-mono text-base"
          />
          <Button type="submit" block loading={busy} icon={<ShieldCheck size={15} />}>
            {busy ? 'A verificar...' : 'Verificar'}
          </Button>
        </form>
        {backToCredentials}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Inicia sessão no back-office.">
      <form
        className="space-y-4"
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          submit('/auth/login', { email, password })
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

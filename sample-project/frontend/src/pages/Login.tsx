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
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const from: string | undefined = location.state?.from
  const target = from?.startsWith('/admin') ? from : '/admin'
  if (user) return <Navigate to={target} replace />

  async function submit(path: string, body: object) {
    setError('')
    setBusy(true)
    try {
      const data = await api<{ otpRequired?: boolean; user?: User }>(path, { method: 'POST', body })
      if (data.otpRequired) {
        setStep('otp')
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
        <button
          onClick={() => {
            setStep('credentials')
            setCode('')
            setError('')
          }}
          className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme"
        >
          <ArrowLeft size={13} /> Voltar
        </button>
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

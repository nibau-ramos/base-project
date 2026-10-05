import { CheckCircle2, Link2Off } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api, errorMessage } from '../lib/api'
import { Button, ButtonLink } from '../ui/Button'
import { Alert, Spinner } from '../ui/feedback'
import { PasswordField } from '../ui/form'

type State = 'checking' | 'ready' | 'invalid' | 'done'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [state, setState] = useState<State>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!token) {
      setState('invalid')
      return
    }
    api<{ email: string }>(`/auth/reset-password/${encodeURIComponent(token)}`)
      .then((data) => {
        setEmail(data.email)
        setState('ready')
      })
      .catch(() => setState('invalid'))
  }, [token])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) return setError('A confirmação não coincide com a nova password.')
    setBusy(true)
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, password, confirmPassword } })
      setState('done')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (state === 'checking') {
    return (
      <AuthLayout title="Definir password">
        <Spinner label="A validar o link…" />
      </AuthLayout>
    )
  }

  if (state === 'invalid') {
    return (
      <AuthLayout title="Link inválido">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
            <Link2Off size={22} className="text-red-600" />
          </div>
          <p className="text-sm text-text-muted">Este link não é válido, já foi utilizado ou expirou.</p>
          <ButtonLink to="/forgot-password" block>
            Pedir um novo link
          </ButtonLink>
        </div>
      </AuthLayout>
    )
  }

  if (state === 'done') {
    return (
      <AuthLayout title="Password atualizada">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 size={22} className="text-green-600" />
          </div>
          <p className="text-sm text-text-muted">A tua password foi atualizada. Já podes entrar com a nova password.</p>
          <ButtonLink to="/login" block>
            Ir para o login
          </ButtonLink>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Definir password" subtitle={<>Conta: <strong className="text-text-base">{email}</strong></>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert>{error}</Alert>
        <PasswordField
          label="Nova password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={8}
          hint="Mínimo de 8 caracteres."
          required
        />
        <PasswordField
          label="Confirmar nova password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
        <Button type="submit" block loading={busy}>
          {busy ? 'A guardar...' : 'Guardar password'}
        </Button>
      </form>
    </AuthLayout>
  )
}

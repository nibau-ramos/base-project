import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api, errorMessage } from '../lib/api'
import { Button } from '../ui/Button'
import { Alert } from '../ui/feedback'
import { TextField } from '../ui/form'

function BackToLogin() {
  return (
    <Link to="/login" className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme">
      <ArrowLeft size={13} /> Voltar ao login
    </Link>
  )
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      setMessage((await api<{ message: string }>('/auth/forgot-password', { method: 'POST', body: { email } })).message)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (message) {
    return (
      <AuthLayout title="Verifica o teu e-mail">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle2 size={22} className="text-green-600" />
          </div>
          <p className="text-sm text-text-muted">{message}</p>
        </div>
        <BackToLogin />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar password" subtitle="Introduz o teu e-mail e enviamos um link de recuperação.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert>{error}</Alert>
        <TextField label="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" autoFocus required />
        <Button type="submit" block loading={busy}>
          {busy ? 'A enviar...' : 'Enviar link de recuperação'}
        </Button>
      </form>
      <BackToLogin />
    </AuthLayout>
  )
}

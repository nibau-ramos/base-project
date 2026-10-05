import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../store/hooks'

type View = 'login' | 'recovery' | 'sent'

function Field({
  label, id, type, value, onChange, error, after,
}: {
  label: string; id: string; type: string; value: string
  onChange: (v: string) => void; error?: string; after?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-base">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-bg text-text-base
            placeholder:text-text-muted outline-none transition-theme
            focus:ring-2 focus:border-primary
            ${error ? 'border-red-400 focus:ring-red-100' : 'border-border focus:ring-primary/10'}
            ${after ? 'pr-10' : ''}`}
        />
        {after && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{after}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Logo({ logoUrl }: { logoUrl: string | null }) {
  return (
    <div className="flex justify-center mb-7">
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className="h-9 w-auto max-w-36 object-contain" />
      ) : (
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >E</div>
          <span className="text-lg font-bold text-text-base">ENSO</span>
        </div>
      )}
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const logoUrl = useAppSelector((s) => s.theme.logoUrl)
  const [view, setView] = useState<View>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  // Recovery state
  const [recEmail, setRecEmail] = useState('')
  const [recError, setRecError] = useState('')
  const [sending, setSending] = useState(false)

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email obrigatório'
    else if (!validateEmail(email)) errs.email = 'Email inválido'
    if (!password) errs.password = 'Password obrigatória'
    else if (password.length < 8) errs.password = 'Mínimo 8 caracteres'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1300))
    navigate('/styleguide/examples/users')
  }

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault()
    if (!recEmail) { setRecError('Email obrigatório'); return }
    if (!validateEmail(recEmail)) { setRecError('Email inválido'); return }
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setView('sent')
  }

  function goToRecovery() {
    setRecEmail(email)
    setRecError('')
    setView('recovery')
  }

  function goToLogin() {
    setView('login')
    setRecEmail('')
    setRecError('')
  }

  /* ── Sent ──────────────────────────────── */
  if (view === 'sent') return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <CheckCircle2 size={22} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-base">Email enviado</h2>
          <p className="text-sm text-text-muted mt-1.5">
            Enviámos um link de recuperação para{' '}
            <strong className="text-text-base">{recEmail}</strong>.
            Verifica a tua caixa de entrada.
          </p>
        </div>
        <button
          onClick={goToLogin}
          className="text-sm font-medium transition-theme"
          style={{ color: 'var(--color-primary)' }}
        >
          Voltar ao login
        </button>
      </div>
    </div>
  )

  /* ── Recovery ──────────────────────────── */
  if (view === 'recovery') return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <Logo logoUrl={logoUrl} />
        <h1 className="text-xl font-bold text-text-base">Recuperar password</h1>
        <p className="text-sm text-text-muted mt-1 mb-6">
          Introduz o teu email e enviamos um link de recuperação.
        </p>
        <form onSubmit={handleRecovery} noValidate className="space-y-4">
          <Field
            label="Email"
            id="rec-email"
            type="email"
            value={recEmail}
            onChange={(v) => { setRecEmail(v); setRecError('') }}
            error={recError}
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl text-white
              disabled:opacity-60 transition-theme"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {sending && <Loader2 size={15} className="animate-spin" />}
            {sending ? 'A enviar...' : 'Enviar link de recuperação'}
          </button>
        </form>
        <button
          onClick={goToLogin}
          className="flex items-center gap-1.5 mt-5 text-sm text-text-muted hover:text-text-base transition-theme"
        >
          <ArrowLeft size={13} /> Voltar ao login
        </button>
      </div>
    </div>
  )

  /* ── Login ─────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <Logo logoUrl={logoUrl} />
          <h1 className="text-xl font-bold text-text-base">Bem-vindo de volta</h1>
          <p className="text-sm text-text-muted mt-1 mb-6">Inicia sessão na tua conta.</p>

          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <Field
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '' })) }}
              error={errors.email}
            />
            <Field
              label="Password"
              id="password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })) }}
              error={errors.password}
              after={
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="text-text-muted hover:text-text-base transition-theme">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToRecovery}
                className="text-xs font-medium transition-theme"
                style={{ color: 'var(--color-primary)' }}
              >
                Esqueceste a password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl
                text-white disabled:opacity-60 transition-theme"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'A entrar...' : 'Iniciar sessão'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-text-muted mt-4">
          <strong>Demo</strong> — usa qualquer email válido + password com 8+ caracteres
        </p>
      </div>
    </div>
  )
}

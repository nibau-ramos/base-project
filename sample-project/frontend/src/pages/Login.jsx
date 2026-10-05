import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('credentials'); // or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const target = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin';
  if (user) return <Navigate to={target} replace />;

  async function submit(path, body) {
    setError('');
    setBusy(true);
    try {
      const data = await api(path, { method: 'POST', body });
      if (data.otpRequired) {
        setStep('otp');
        return;
      }
      setUser(data.user);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (step === 'otp') {
    return (
      <AuthLayout title="Verificação em dois passos">
        <p className="muted">Introduza o código de 6 dígitos da sua aplicação autenticadora.</p>
        <form className="form" onSubmit={(e) => (e.preventDefault(), submit('/auth/otp', { code }))}>
          <Alert>{error}</Alert>
          <label className="field">
            <span>Código</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]*"
              maxLength={7}
              autoFocus
              required
            />
          </label>
          <button className="button button--block" disabled={busy}>Verificar</button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setStep('credentials');
              setCode('');
              setError('');
            }}
          >
            Voltar
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Entrar">
      <form className="form" onSubmit={(e) => (e.preventDefault(), submit('/auth/login', { email, password }))}>
        <Alert>{error}</Alert>
        <label className="field">
          <span>E-mail</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="button button--block" disabled={busy}>Entrar</button>
        <Link className="form__link" to="/forgot-password">Esqueceu-se da password?</Link>
      </form>
    </AuthLayout>
  );
}

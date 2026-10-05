import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import { api } from '../lib/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [state, setState] = useState('checking'); // checking | ready | invalid | done
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return setState('invalid');
    api(`/auth/reset-password/${encodeURIComponent(token)}`)
      .then((data) => {
        setEmail(data.email);
        setState('ready');
      })
      .catch(() => setState('invalid'));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('A confirmação não coincide com a nova password.');
    setBusy(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, password, confirmPassword } });
      setState('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (state === 'checking') return <AuthLayout title="Definir password"><p className="muted">A validar o link…</p></AuthLayout>;

  if (state === 'invalid') {
    return (
      <AuthLayout title="Link inválido">
        <Alert>Este link não é válido, já foi utilizado ou expirou.</Alert>
        <Link className="button button--block" to="/forgot-password">Pedir um novo link</Link>
      </AuthLayout>
    );
  }

  if (state === 'done') {
    return (
      <AuthLayout title="Password atualizada">
        <Alert type="success">A sua password foi atualizada. Já pode entrar com a nova password.</Alert>
        <Link className="button button--block" to="/login">Ir para o login</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Definir password">
      <form className="form" onSubmit={handleSubmit}>
        <p className="muted">Conta: {email}</p>
        <Alert>{error}</Alert>
        <label className="field">
          <span>Nova password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
          <small className="muted">Mínimo de 8 caracteres.</small>
        </label>
        <label className="field">
          <span>Confirmar nova password</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
        </label>
        <button className="button button--block" disabled={busy}>Guardar password</button>
      </form>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import { api } from '../lib/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      setMessage((await api('/auth/forgot-password', { method: 'POST', body: { email } })).message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Recuperar password">
      {message ? (
        <>
          <Alert type="success">{message}</Alert>
          <Link className="form__link" to="/login">Voltar ao login</Link>
        </>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="muted">Indique o seu e-mail para receber um link de redefinição de password.</p>
          <Alert>{error}</Alert>
          <label className="field">
            <span>E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus required />
          </label>
          <button className="button button--block" disabled={busy}>Enviar link</button>
          <Link className="form__link" to="/login">Voltar ao login</Link>
        </form>
      )}
    </AuthLayout>
  );
}

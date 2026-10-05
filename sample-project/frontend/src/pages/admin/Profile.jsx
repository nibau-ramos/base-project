import { useState } from 'react';
import Alert from '../../components/Alert.jsx';
import { api } from '../../lib/api.js';
import { ROLE_LABELS, useAuth } from '../../lib/auth.jsx';

function ChangePassword() {
  const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.newPassword !== form.confirmPassword) return setError('A confirmação não coincide com a nova password.');
    setBusy(true);
    try {
      setMessage((await api('/profile/password', { method: 'PUT', body: form })).message);
      setForm(empty);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <h2>Alterar password</h2>
      <form className="form" onSubmit={handleSubmit}>
        <Alert>{error}</Alert>
        <Alert type="success">{message}</Alert>
        <label className="field">
          <span>Password atual</span>
          <input type="password" value={form.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" required />
        </label>
        <label className="field">
          <span>Nova password</span>
          <input type="password" value={form.newPassword} onChange={set('newPassword')} autoComplete="new-password" minLength={8} required />
          <small className="muted">Mínimo de 8 caracteres.</small>
        </label>
        <label className="field">
          <span>Confirmar nova password</span>
          <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" required />
        </label>
        <div className="form__actions">
          <button className="button" disabled={busy}>Guardar</button>
        </div>
      </form>
    </section>
  );
}

function Otp() {
  const { user, setUser } = useAuth();
  const [setup, setSetup] = useState(null); // { qr, secret }
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(fn) {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const start = () => run(async () => setSetup(await api('/profile/otp/setup', { method: 'POST' })));

  const confirm = (e) => {
    e.preventDefault();
    run(async () => {
      setUser((await api('/profile/otp/confirm', { method: 'POST', body: { code } })).user);
      setSetup(null);
      setCode('');
      setMessage('OTP ativado. A partir de agora, será pedido um código ao entrar.');
    });
  };

  const disable = (e) => {
    e.preventDefault();
    run(async () => {
      setUser((await api('/profile/otp/disable', { method: 'POST', body: { password } })).user);
      setPassword('');
      setMessage('OTP desativado.');
    });
  };

  return (
    <section className="card">
      <h2>Verificação em dois passos (OTP)</h2>
      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {user.otpEnabled ? (
        <form className="form" onSubmit={disable}>
          <p>
            Estado: <span className="badge badge--success">Ativo</span>
          </p>
          <label className="field">
            <span>Confirme a sua password para desativar</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
          <div className="form__actions">
            <button className="button button--danger" disabled={busy}>Desativar OTP</button>
          </div>
        </form>
      ) : setup ? (
        <form className="form" onSubmit={confirm}>
          <p className="muted">
            Leia o código QR com uma aplicação autenticadora (Google Authenticator, Microsoft Authenticator, 1Password…) e
            introduza o código gerado para confirmar.
          </p>
          <img className="otp-qr" src={setup.qr} alt="Código QR para configurar o OTP" />
          <p className="muted otp-secret">
            Chave manual: <code>{setup.secret}</code>
          </p>
          <label className="field">
            <span>Código</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={7} required />
          </label>
          <div className="form__actions">
            <button type="button" className="button button--ghost" onClick={() => setSetup(null)}>Cancelar</button>
            <button className="button" disabled={busy}>Confirmar e ativar</button>
          </div>
        </form>
      ) : (
        <>
          <p>
            Estado: <span className="badge">Inativo</span>
          </p>
          <p className="muted">Proteja a sua conta com um código adicional gerado no telemóvel.</p>
          <div className="form__actions">
            <button className="button" onClick={start} disabled={busy}>Ativar OTP</button>
          </div>
        </>
      )}
    </section>
  );
}

export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      <div className="page-header">
        <h1>O meu perfil</h1>
        <p className="muted">
          {user.email} · {ROLE_LABELS[user.role]}
        </p>
      </div>
      <div className="grid">
        <ChangePassword />
        <Otp />
      </div>
    </>
  );
}

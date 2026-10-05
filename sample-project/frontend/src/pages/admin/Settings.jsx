import { useEffect, useState } from 'react';
import { NavLink, Navigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/auth.jsx';
import { useBranding } from '../../lib/branding.jsx';

function useStatus() {
  const [status, setStatus] = useState({ error: '', message: '', busy: false });
  async function run(fn) {
    setStatus({ error: '', message: '', busy: true });
    try {
      setStatus({ error: '', message: (await fn()) || '', busy: false });
    } catch (err) {
      setStatus({ error: err.message, message: '', busy: false });
    }
  }
  return [status, run];
}

function EmailSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [testTo, setTestTo] = useState(user.email);
  const [status, run] = useStatus();
  const [testStatus, runTest] = useStatus();

  useEffect(() => {
    api('/settings/email').then((s) => setForm({ ...s, password: '', clearPassword: false }));
  }, []);

  if (!form) return <p className="muted">A carregar…</p>;
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = (e) => {
    e.preventDefault();
    run(async () => {
      const saved = await api('/settings/email', { method: 'PUT', body: form });
      setForm({ ...saved, password: '', clearPassword: false });
      return 'Configuração guardada.';
    });
  };

  return (
    <div className="grid">
      <section className="card">
        <h2>Servidor de envio</h2>
        <form className="form" onSubmit={save}>
          <Alert>{status.error}</Alert>
          <Alert type="success">{status.message}</Alert>
          <div className="form__row">
            <label className="field field--grow">
              <span>Host</span>
              <input value={form.host} onChange={set('host')} placeholder="smtp.exemplo.pt" required />
            </label>
            <label className="field field--small">
              <span>Porta</span>
              <input type="number" min="1" max="65535" value={form.port} onChange={set('port')} required />
            </label>
          </div>
          <label className="field">
            <span>Protocolo</span>
            <select value={form.protocol} onChange={set('protocol')}>
              <option value="smtp">SMTP</option>
            </select>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={form.ssl} onChange={set('ssl')} />
            <span>Usar SSL/TLS (normalmente na porta 465)</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={form.ignoreCertificates} onChange={set('ignoreCertificates')} />
            <span>Ignorar certificados inválidos</span>
          </label>
          <label className="field">
            <span>Utilizador</span>
            <input value={form.user} onChange={set('user')} autoComplete="off" />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              placeholder={form.hasPassword ? '•••••••• (guardada — deixe vazio para manter)' : ''}
              disabled={form.clearPassword}
            />
          </label>
          {form.hasPassword && (
            <label className="checkbox">
              <input type="checkbox" checked={form.clearPassword} onChange={set('clearPassword')} />
              <span>Remover a password guardada</span>
            </label>
          )}
          <label className="field">
            <span>E-mail do remetente</span>
            <input type="email" value={form.fromAddress} onChange={set('fromAddress')} placeholder="no-reply@exemplo.pt" required />
          </label>
          <div className="form__actions">
            <button className="button" disabled={status.busy}>Guardar</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>E-mail de teste</h2>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            runTest(async () => (await api('/settings/email/test', { method: 'POST', body: { to: testTo } })).message);
          }}
        >
          <p className="muted">Envia um e-mail com a configuração guardada. Guarde primeiro as alterações.</p>
          <Alert>{testStatus.error && `O servidor devolveu um erro: ${testStatus.error}`}</Alert>
          <Alert type="success">{testStatus.message}</Alert>
          <label className="field">
            <span>Destinatário</span>
            <input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} required />
          </label>
          <div className="form__actions">
            <button className="button" disabled={testStatus.busy}>{testStatus.busy ? 'A enviar…' : 'Enviar teste'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function BrandingSettings() {
  const { branding, setBranding } = useBranding();
  const [form, setForm] = useState({ projectTitle: branding.projectTitle, clientName: branding.clientName });
  const [file, setFile] = useState(null);
  const [status, run] = useStatus();
  const [logoStatus, runLogo] = useStatus();

  useEffect(() => {
    setForm({ projectTitle: branding.projectTitle, clientName: branding.clientName });
  }, [branding.projectTitle, branding.clientName]);

  const save = (e) => {
    e.preventDefault();
    run(async () => {
      setBranding(await api('/settings/branding', { method: 'PUT', body: form }));
      return 'Branding guardado.';
    });
  };

  const upload = (e) => {
    e.preventDefault();
    runLogo(async () => {
      const body = new FormData();
      body.append('logo', file);
      setBranding(await api('/settings/branding/logo', { method: 'POST', body }));
      setFile(null);
      e.target.reset();
      return 'Logótipo atualizado.';
    });
  };

  const removeLogo = () =>
    runLogo(async () => {
      setBranding(await api('/settings/branding/logo', { method: 'DELETE' }));
      return 'Logótipo removido.';
    });

  return (
    <div className="grid">
      <section className="card">
        <h2>Identidade</h2>
        <form className="form" onSubmit={save}>
          <Alert>{status.error}</Alert>
          <Alert type="success">{status.message}</Alert>
          <label className="field">
            <span>Título do projeto</span>
            <input value={form.projectTitle} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })} required />
          </label>
          <label className="field">
            <span>Nome do cliente</span>
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </label>
          <div className="form__actions">
            <button className="button" disabled={status.busy}>Guardar</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Logótipo</h2>
        <p className="muted">Apresentado na página de login, nos e-mails e usado como favicon.</p>
        <div className="logo-preview">
          {branding.logoUrl ? <img src={branding.logoUrl} alt="Logótipo atual" /> : <span className="muted">Sem logótipo</span>}
        </div>
        <form className="form" onSubmit={upload}>
          <Alert>{logoStatus.error}</Alert>
          <Alert type="success">{logoStatus.message}</Alert>
          <label className="field">
            <span>Novo logótipo (PNG, JPG, SVG, WEBP ou ICO, até 1 MB)</span>
            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon" onChange={(e) => setFile(e.target.files[0] || null)} required />
          </label>
          <div className="form__actions">
            {branding.logoUrl && (
              <button type="button" className="button button--ghost button--danger-text" onClick={removeLogo} disabled={logoStatus.busy}>
                Remover
              </button>
            )}
            <button className="button" disabled={!file || logoStatus.busy}>Carregar</button>
          </div>
        </form>
      </section>
    </div>
  );
}

const SECTIONS = { email: { label: 'E-mail', Component: EmailSettings }, branding: { label: 'Branding', Component: BrandingSettings } };

export default function Settings() {
  const { section } = useParams();
  if (!SECTIONS[section]) return <Navigate to="/admin/settings/email" replace />;
  const { Component } = SECTIONS[section];

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <nav className="tabs">
        {Object.entries(SECTIONS).map(([key, { label }]) => (
          <NavLink key={key} to={`/admin/settings/${key}`}>{label}</NavLink>
        ))}
      </nav>
      <Component key={section} />
    </>
  );
}

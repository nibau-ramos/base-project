import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert.jsx';
import Modal from '../../components/Modal.jsx';
import { api } from '../../lib/api.js';
import { ROLE_LABELS, useAuth } from '../../lib/auth.jsx';
import { formatDate } from '../../lib/dates.js';

// Mirrors the backend rule: admins manage admins and normal users; super admins manage everyone.
const assignableRoles = (actorRole) => (actorRole === 'super_admin' ? ['super_admin', 'admin', 'normal'] : ['admin', 'normal']);

function UserForm({ initial, roles, isNew, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <form className="form" onSubmit={(e) => (e.preventDefault(), onSubmit(form))}>
      <label className="field">
        <span>E-mail</span>
        <input type="email" value={form.email} onChange={set('email')} disabled={!isNew} required />
      </label>
      <label className="field">
        <span>Nome</span>
        <input value={form.name} onChange={set('name')} />
      </label>
      <label className="field">
        <span>Perfil</span>
        <select value={form.role} onChange={set('role')}>
          {roles.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </label>
      {isNew ? (
        <label className="field">
          <span>Password inicial (opcional)</span>
          <input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" minLength={8} />
          <small className="muted">Se ficar vazia, envie o e-mail de boas-vindas com link para definir password.</small>
        </label>
      ) : (
        <label className="checkbox">
          <input type="checkbox" checked={form.active} onChange={set('active')} />
          <span>Conta ativa</span>
        </label>
      )}
      <div className="form__actions">
        <button type="button" className="button button--ghost" onClick={onCancel}>Cancelar</button>
        <button className="button" disabled={busy}>{isNew ? 'Criar utilizador' : 'Guardar'}</button>
      </div>
    </form>
  );
}

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'create'|'edit'|'welcome'|'delete', user? }
  const [includeReset, setIncludeReset] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const roles = assignableRoles(me.role);

  const load = useCallback(() => {
    api('/users')
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  const open = (type, user) => {
    setModalError('');
    setIncludeReset(true);
    setModal({ type, user });
  };
  const close = () => setModal(null);

  async function run(fn) {
    setModalError('');
    setBusy(true);
    try {
      const msg = await fn();
      setMessage(msg || '');
      close();
      load();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const canManage = (u) => roles.includes(u.role);

  return (
    <>
      <div className="page-header page-header--row">
        <div>
          <h1>Utilizadores</h1>
          <p className="muted">O e-mail é o identificador de login de cada utilizador.</p>
        </div>
        <button className="button" onClick={() => open('create')}>Novo utilizador</button>
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {users === null ? (
        <p className="muted">A carregar…</p>
      ) : (
        <div className="card card--flush">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Estado</th>
                <th>Último acesso</th>
                <th>Criado em</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Nome">{u.name || '—'}</td>
                  <td data-label="E-mail">{u.email}</td>
                  <td data-label="Perfil">{ROLE_LABELS[u.role]}</td>
                  <td data-label="Estado">
                    <span className="badges">
                      <span className={`badge ${u.active ? 'badge--success' : ''}`}>{u.active ? 'Ativo' : 'Inativo'}</span>
                      {u.otpEnabled && <span className="badge">OTP</span>}
                    </span>
                  </td>
                  <td data-label="Último acesso">{formatDate(u.lastLoginAt, 'datetime') || '—'}</td>
                  <td data-label="Criado em">{formatDate(u.createdAt)}</td>
                  <td className="table__actions">
                    {canManage(u) && (
                      <>
                        <button className="button button--small button--ghost" onClick={() => open('welcome', u)}>Boas-vindas</button>
                        <button className="button button--small button--ghost" onClick={() => open('edit', u)}>Editar</button>
                        {u.id !== me.id && (
                          <button className="button button--small button--ghost button--danger-text" onClick={() => open('delete', u)}>
                            Eliminar
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === 'create' && (
        <Modal title="Novo utilizador" onClose={close}>
          <Alert>{modalError}</Alert>
          <UserForm
            isNew
            roles={roles}
            busy={busy}
            initial={{ email: '', name: '', role: 'normal', password: '' }}
            onCancel={close}
            onSubmit={(form) =>
              run(async () => {
                const { user } = await api('/users', { method: 'POST', body: form });
                return `Utilizador ${user.email} criado.`;
              })
            }
          />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Editar utilizador" onClose={close}>
          <Alert>{modalError}</Alert>
          <UserForm
            roles={roles}
            busy={busy}
            initial={{ email: modal.user.email, name: modal.user.name, role: modal.user.role, active: modal.user.active }}
            onCancel={close}
            onSubmit={(form) =>
              run(async () => {
                await api(`/users/${modal.user.id}`, { method: 'PUT', body: { name: form.name, role: form.role, active: form.active } });
                return 'Utilizador atualizado.';
              })
            }
          />
        </Modal>
      )}

      {modal?.type === 'welcome' && (
        <Modal title="Enviar e-mail de boas-vindas" onClose={close}>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => (await api(`/users/${modal.user.id}/welcome`, { method: 'POST', body: { includeReset } })).message);
            }}
          >
            <Alert>{modalError}</Alert>
            {modalError.includes('configurar o envio de e-mail') && (
              <Link to="/admin/settings/email">Ir para as settings de e-mail</Link>
            )}
            <p>
              Será enviado a <strong>{modal.user.email}</strong> um e-mail a indicar que pertence à plataforma.
            </p>
            <label className="checkbox">
              <input type="checkbox" checked={includeReset} onChange={(e) => setIncludeReset(e.target.checked)} />
              <span>Incluir link para definir a password</span>
            </label>
            <div className="form__actions">
              <button type="button" className="button button--ghost" onClick={close}>Cancelar</button>
              <button className="button" disabled={busy}>Enviar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Eliminar utilizador" onClose={close}>
          <Alert>{modalError}</Alert>
          <p>
            Tem a certeza de que quer eliminar <strong>{modal.user.email}</strong>? Esta ação não pode ser desfeita.
          </p>
          <div className="form__actions">
            <button className="button button--ghost" onClick={close}>Cancelar</button>
            <button
              className="button button--danger"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/users/${modal.user.id}`, { method: 'DELETE' });
                  return 'Utilizador eliminado.';
                })
              }
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

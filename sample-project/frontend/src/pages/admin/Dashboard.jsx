import { Link } from 'react-router-dom';
import { isAdmin, ROLE_LABELS, useAuth } from '../../lib/auth.jsx';
import { formatDate } from '../../lib/dates.js';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <div className="page-header">
        <h1>Olá{user.name ? `, ${user.name}` : ''}</h1>
        <p className="muted">Bem-vindo(a) ao back-office.</p>
      </div>
      <div className="grid">
        <section className="card">
          <h2>A sua conta</h2>
          <dl className="details">
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
            <dt>Perfil</dt>
            <dd>{ROLE_LABELS[user.role]}</dd>
            <dt>OTP</dt>
            <dd>{user.otpEnabled ? 'Ativo' : 'Inativo'}</dd>
            <dt>Último acesso</dt>
            <dd>{formatDate(user.lastLoginAt, 'datetime') || '—'}</dd>
          </dl>
          <Link to="/admin/profile">Gerir o meu perfil</Link>
        </section>
        {isAdmin(user) && (
          <section className="card">
            <h2>Administração</h2>
            <ul className="link-list">
              <li><Link to="/admin/users">Gerir utilizadores</Link></li>
              <li><Link to="/admin/settings/email">Configurar envio de e-mail</Link></li>
              <li><Link to="/admin/settings/branding">Configurar branding</Link></li>
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

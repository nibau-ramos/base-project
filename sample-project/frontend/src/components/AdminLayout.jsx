import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isAdmin, ROLE_LABELS, useAuth } from '../lib/auth.jsx';
import { useBranding } from '../lib/branding.jsx';
import BrandMark from './BrandMark.jsx';
import PoweredBy from './PoweredBy.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={`admin ${menuOpen ? 'admin--menu-open' : ''}`}>
      <aside className="admin__sidebar">
        <div className="admin__sidebar-brand">
          {branding.logoUrl && (
            <span className="admin__sidebar-logo">
              <img src={branding.logoUrl} alt="" />
            </span>
          )}
          <strong>{branding.projectTitle}</strong>
          {branding.clientName && <span>{branding.clientName}</span>}
        </div>
        <nav className="admin__nav">
          <NavLink to="/admin" end>Painel</NavLink>
          {isAdmin(user) && <NavLink to="/admin/users">Utilizadores</NavLink>}
          {isAdmin(user) && <NavLink to="/admin/settings">Settings</NavLink>}
          <NavLink to="/admin/profile">O meu perfil</NavLink>
        </nav>
        <div className="admin__sidebar-footer">
          <PoweredBy variant="light" />
        </div>
      </aside>
      <div className="admin__backdrop" onClick={() => setMenuOpen(false)} />

      <div className="admin__main">
        <header className="admin__topbar">
          <button className="icon-button admin__menu-button" aria-label="Abrir menu" onClick={() => setMenuOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
          <div className="admin__topbar-title">
            <BrandMark compact />
          </div>
          <div className="admin__user">
            <div className="admin__user-info">
              <strong>{user.name || user.email}</strong>
              <span className="muted">{ROLE_LABELS[user.role]}</span>
            </div>
            <button className="button button--ghost" onClick={handleLogout}>Sair</button>
          </div>
        </header>
        <main className="admin__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

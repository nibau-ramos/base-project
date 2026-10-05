import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, useAuth } from '../lib/auth.jsx';

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) return <div className="page-loading">A carregar…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!isAdmin(user)) {
    return (
      <div className="card">
        <h1>Acesso negado</h1>
        <p className="muted">Esta área está disponível apenas para administradores.</p>
      </div>
    );
  }
  return children;
}

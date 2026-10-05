import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark.jsx';
import { useAuth } from '../lib/auth.jsx';
import { useBranding } from '../lib/branding.jsx';
import { formatDate } from '../lib/dates.js';

// Public front-end: no authentication. Replace with the project's real public pages.
export default function Home() {
  const { branding } = useBranding();
  const { user } = useAuth();
  return (
    <div className="public">
      <header className="public__header">
        <BrandMark />
        <Link className="button" to={user ? '/admin' : '/login'}>
          {user ? 'Back-office' : 'Entrar'}
        </Link>
      </header>
      <main className="public__hero">
        <p className="eyebrow">{branding.clientName}</p>
        <h1>{branding.projectTitle}</h1>
        <p className="lead">
          Esta é a zona pública da aplicação, acessível sem autenticação. A gestão da plataforma está no back-office, em
          /admin.
        </p>
        <div className="public__grid">
          <article className="card">
            <h2>Zona pública</h2>
            <p className="muted">Páginas abertas a qualquer visitante, responsivas em desktop, tablet e telemóvel.</p>
          </article>
          <article className="card">
            <h2>Back-office</h2>
            <p className="muted">Autenticação por e-mail e password, com OTP, gestão de utilizadores e settings.</p>
          </article>
          <article className="card">
            <h2>Formato de datas</h2>
            <p className="muted">Hoje: {formatDate(new Date())} · Agora: {formatDate(new Date(), 'datetime')}</p>
          </article>
        </div>
      </main>
      <footer className="public__footer muted">
        {branding.projectTitle}
        {branding.clientName ? ` · ${branding.clientName}` : ''}
      </footer>
    </div>
  );
}

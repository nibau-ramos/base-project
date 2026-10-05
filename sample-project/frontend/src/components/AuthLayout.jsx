import { Link } from 'react-router-dom';
import { useBranding } from '../lib/branding.jsx';
import PoweredBy from './PoweredBy.jsx';

// Shell for login, OTP, forgot and reset password: client logo on top, ENSO mark at the bottom.
export default function AuthLayout({ title, children }) {
  const { branding } = useBranding();
  return (
    <div className="auth">
      <main className="auth__card">
        <Link to="/" className="auth__brand">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.clientName || branding.projectTitle} />
          ) : (
            <span className="auth__brand-text">{branding.projectTitle}</span>
          )}
        </Link>
        <h1>{title}</h1>
        {children}
      </main>
      <PoweredBy />
    </div>
  );
}

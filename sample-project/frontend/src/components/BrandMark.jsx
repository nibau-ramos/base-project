import { useBranding } from '../lib/branding.jsx';

// `compact` shows only the logo when there is one (tight spaces such as the mobile top bar).
export default function BrandMark({ compact = false }) {
  const { branding } = useBranding();
  const showTitle = !compact || !branding.logoUrl;
  return (
    <span className="brand-mark">
      {branding.logoUrl && <img src={branding.logoUrl} alt={compact ? branding.projectTitle : ''} />}
      {showTitle && <span>{branding.projectTitle}</span>}
    </span>
  );
}

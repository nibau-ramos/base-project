import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const BrandingContext = createContext(null);

const FALLBACK = { projectTitle: 'Projeto Base', clientName: '', logoUrl: null };

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(FALLBACK);

  const reload = useCallback(async () => {
    try {
      setBranding(await api('/branding'));
    } catch {
      setBranding(FALLBACK);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // The favicon is always the branding logo; the tab title is the project title.
  useEffect(() => {
    document.title = branding.projectTitle || FALLBACK.projectTitle;
    const link = document.getElementById('favicon');
    if (link) link.href = branding.logoUrl || '/enso/enso-mark.svg';
  }, [branding]);

  return <BrandingContext.Provider value={{ branding, setBranding, reload }}>{children}</BrandingContext.Provider>;
}

export const useBranding = () => useContext(BrandingContext);

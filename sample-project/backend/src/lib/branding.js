import { getSetting, query } from '../db.js';

// The style guide's four base colors; every project can override them in the branding settings.
export const COLOR_KEYS = ['primary', 'secondary', 'neutral', 'accent'];
export const DEFAULT_COLORS = { primary: '#0086ac', secondary: '#0f172a', neutral: '#6b7280', accent: '#f97316' };

export const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

export function normalizeColors(input = {}) {
  return Object.fromEntries(
    COLOR_KEYS.map((key) => [key, isHexColor(input[key]) ? input[key].toLowerCase() : DEFAULT_COLORS[key]]),
  );
}

export async function getBranding() {
  const value = (await getSetting('branding')) || {};
  const { rows } = await query('SELECT mime, updated_at FROM branding_logo WHERE id = 1');
  const logo = rows[0];
  return {
    projectTitle: value.projectTitle || '',
    clientName: value.clientName || '',
    colors: normalizeColors(value.colors),
    logoUrl: logo ? `/api/branding/logo?v=${new Date(logo.updated_at).getTime()}` : null,
  };
}

export async function getLogo() {
  const { rows } = await query('SELECT data, mime FROM branding_logo WHERE id = 1');
  return rows[0] || null;
}

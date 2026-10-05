import { getSetting, query } from '../db.js';

export async function getBranding() {
  const value = (await getSetting('branding')) || {};
  const { rows } = await query('SELECT mime, updated_at FROM branding_logo WHERE id = 1');
  const logo = rows[0];
  return {
    projectTitle: value.projectTitle || '',
    clientName: value.clientName || '',
    logoUrl: logo ? `/api/branding/logo?v=${new Date(logo.updated_at).getTime()}` : null,
  };
}

export async function getLogo() {
  const { rows } = await query('SELECT data, mime FROM branding_logo WHERE id = 1');
  return rows[0] || null;
}

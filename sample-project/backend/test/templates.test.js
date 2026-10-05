import assert from 'node:assert/strict';
import { test } from 'node:test';
import { layout, passwordResetEmail, welcomeEmail } from '../src/emails/templates.js';

const branding = { projectTitle: 'Portal Exemplo', clientName: 'Cliente <X>' };
const user = { name: 'Maria', email: 'maria@exemplo.pt' };

test('layout shows branding, escapes values and uses the ENSO date format', () => {
  const html = layout({ branding, hasLogo: true, heading: 'Olá', now: new Date('2026-10-05T14:30:15') });
  assert.match(html, /cid:brand-logo/);
  assert.match(html, /Portal Exemplo/);
  assert.match(html, /Cliente &lt;X&gt;/);
  assert.match(html, /2026\/10\/05 14:30/);
});

test('action button uses the branding primary color, falling back to ENSO blue', () => {
  const action = { label: 'Entrar', url: 'http://app/login' };
  assert.match(layout({ branding: { ...branding, colors: { primary: '#e4572e' } }, heading: 'x', action }), /background:#e4572e/);
  assert.match(layout({ branding: { ...branding, colors: { primary: 'red;x' } }, heading: 'x', action }), /background:#0086ac/);
});

test('welcome e-mail only carries a reset link when asked to', () => {
  const reset = { url: 'http://app/reset-password?token=t', expiresAt: new Date('2026-10-08T14:30:00') };
  const withReset = welcomeEmail({ branding, user, reset, loginUrl: 'http://app/login' });
  const without = welcomeEmail({ branding, user, reset: null, loginUrl: 'http://app/login' });
  assert.equal(withReset.action.url, reset.url);
  assert.match(withReset.footnote, /2026\/10\/08 14:30/);
  assert.equal(without.action.url, 'http://app/login');
  assert.ok(!JSON.stringify(without).includes('reset-password'));
});

test('password reset e-mail links to the reset page', () => {
  const reset = { url: 'http://app/reset-password?token=t', expiresAt: new Date() };
  assert.equal(passwordResetEmail({ branding, user, reset }).action.url, reset.url);
});

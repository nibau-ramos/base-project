import { formatDate } from '../lib/dates.js';

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Shared HTML layout for every system e-mail: branding logo, project title, client name.
// `hasLogo` means the logo is attached inline with cid "brand-logo".
export function layout({ branding, hasLogo, heading, paragraphs = [], action, footnote, now = new Date() }) {
  const title = escapeHtml(branding.projectTitle);
  const client = escapeHtml(branding.clientName);
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px;line-height:1.5">${escapeHtml(p)}</p>`).join('');
  const button = action
    ? `<p style="margin:24px 0"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#0086ac;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600">${escapeHtml(action.label)}</a></p>
       <p style="margin:0 0 16px;font-size:13px;color:#555;word-break:break-all">${escapeHtml(action.url)}</p>`
    : '';
  const logo = hasLogo
    ? `<img src="cid:brand-logo" alt="${title}" style="max-height:56px;max-width:200px;display:block;margin:0 auto 12px">`
    : '';

  return `<!doctype html>
<html lang="pt">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:#f3f5f7;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#1d2433">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f5f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden">
        <tr><td style="padding:28px 28px 16px;text-align:center;border-bottom:1px solid #e6e9ee">
          ${logo}
          <div style="font-size:18px;font-weight:700">${title}</div>
          ${client ? `<div style="font-size:13px;color:#6b7280;margin-top:4px">${client}</div>` : ''}
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(heading)}</h1>
          ${body}
          ${button}
          ${footnote ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280">${escapeHtml(footnote)}</p>` : ''}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280;text-align:center">
          ${title}${client ? ` · ${client}` : ''} · ${formatDate(now, 'datetime')}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const greeting = (user) => `Olá${user.name ? ` ${user.name}` : ''},`;

export function welcomeEmail({ branding, user, reset, loginUrl }) {
  const project = branding.projectTitle || 'a plataforma';
  return {
    subject: `Bem-vindo(a) a ${project}`,
    heading: `Bem-vindo(a) a ${project}`,
    paragraphs: [
      greeting(user),
      `A sua conta em ${project} foi criada. Para entrar, utilize o seu e-mail: ${user.email}.`,
      reset ? 'Utilize o botão abaixo para definir a sua password.' : 'Utilize a password que lhe foi comunicada pelo administrador.',
    ],
    action: reset ? { label: 'Definir password', url: reset.url } : { label: 'Entrar', url: loginUrl },
    footnote: reset ? `Este link é válido até ${formatDate(reset.expiresAt, 'datetime')}.` : undefined,
  };
}

export function passwordResetEmail({ branding, user, reset }) {
  return {
    subject: `Recuperação de password — ${branding.projectTitle}`,
    heading: 'Recuperação de password',
    paragraphs: [
      greeting(user),
      'Recebemos um pedido para redefinir a password da sua conta.',
      'Se não fez este pedido, pode ignorar este e-mail; a sua password não será alterada.',
    ],
    action: { label: 'Redefinir password', url: reset.url },
    footnote: `Este link é válido até ${formatDate(reset.expiresAt, 'datetime')} e só pode ser utilizado uma vez.`,
  };
}

// Generic notice ("aviso"), e.g. password changed.
export function noticeEmail({ user, heading, message, at = new Date() }) {
  return {
    subject: heading,
    heading,
    paragraphs: [greeting(user), message, `Data: ${formatDate(at, 'datetime')}`],
  };
}

export function testEmail({ branding, sentAt = new Date() }) {
  return {
    subject: `E-mail de teste — ${branding.projectTitle}`,
    heading: 'E-mail de teste',
    paragraphs: [
      'Se está a ler esta mensagem, a configuração de envio de e-mail está a funcionar.',
      `Enviado em ${formatDate(sentAt, 'datetime-seconds')}.`,
    ],
  };
}

import nodemailer from 'nodemailer';
import { getSetting, setSetting } from '../db.js';
import { layout } from '../emails/templates.js';
import { getBranding, getLogo } from './branding.js';
import { decrypt, encrypt } from './crypto.js';

export class EmailNotConfiguredError extends Error {
  constructor() {
    super('É necessário configurar o envio de e-mail nas settings.');
  }
}

const DEFAULTS = { host: '', port: 587, protocol: 'smtp', ssl: false, ignoreCertificates: false, user: '', fromAddress: '' };

// Settings as stored, password still encrypted.
async function readStored() {
  return { ...DEFAULTS, passwordEnc: null, ...((await getSetting('email')) || {}) };
}

// Safe for the API: the password is never returned, only whether one is set.
export async function getEmailSettingsForApi() {
  const { passwordEnc, ...rest } = await readStored();
  return { ...rest, hasPassword: Boolean(passwordEnc) };
}

/** `password`: undefined keeps the stored one, '' clears it, anything else replaces it. */
export async function saveEmailSettings(input) {
  const current = await readStored();
  const next = {
    host: input.host.trim(),
    port: input.port,
    protocol: input.protocol,
    ssl: input.ssl,
    ignoreCertificates: input.ignoreCertificates,
    user: input.user.trim(),
    fromAddress: input.fromAddress.trim(),
    passwordEnc: input.password === undefined ? current.passwordEnc : encrypt(input.password),
  };
  await setSetting('email', next);
}

export async function isEmailConfigured() {
  const s = await readStored();
  return Boolean(s.host && s.fromAddress);
}

async function createTransport() {
  const s = await readStored();
  if (!s.host || !s.fromAddress) throw new EmailNotConfiguredError();
  const transport = nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.ssl,
    auth: s.user ? { user: s.user, pass: decrypt(s.passwordEnc) } : undefined,
    tls: { rejectUnauthorized: !s.ignoreCertificates },
    connectionTimeout: 10_000,
  });
  return { transport, from: s.fromAddress };
}

/** Sends a branded HTML e-mail. `content` comes from one of the builders in emails/templates.js. */
export async function sendSystemEmail(to, content) {
  const { transport, from } = await createTransport();
  const [branding, logo] = await Promise.all([getBranding(), getLogo()]);
  const html = layout({ branding, hasLogo: Boolean(logo), ...content });
  const fromName = branding.projectTitle || branding.clientName;

  await transport.sendMail({
    from: fromName ? { name: fromName, address: from } : from,
    to,
    subject: content.subject,
    html,
    text: [content.heading, ...(content.paragraphs || []), content.action?.url, content.footnote].filter(Boolean).join('\n\n'),
    attachments: logo ? [{ filename: 'logo', content: logo.data, contentType: logo.mime, cid: 'brand-logo' }] : [],
  });
}

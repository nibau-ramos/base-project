const env = process.env;

if (!env.APP_SECRET && env.NODE_ENV === 'production') {
  throw new Error('APP_SECRET must be set in production');
}

export const config = {
  port: Number(env.PORT || 4000),
  databaseUrl: env.DATABASE_URL || 'postgres://base:base@localhost:5432/base',
  // Signs session cookies and encrypts stored secrets (SMTP password, OTP secrets).
  appSecret: env.APP_SECRET || 'dev-only-secret-change-me',
  // Public URL of the front-end, used to build links in e-mails.
  appUrl: (env.APP_URL || 'http://localhost:8080').replace(/\/$/, ''),
  // Development only: browser URL of the Mailpit inbox. When set, the front-end shows links to it.
  mailpitUrl: env.MAILPIT_URL || null,
  cookieSecure: env.COOKIE_SECURE === 'true',
  sessionHours: Number(env.SESSION_HOURS || 12),

  seedAdmin: {
    email: env.ADMIN_EMAIL || 'admin@exemplo.pt',
    password: env.ADMIN_PASSWORD || 'admin12345',
    name: env.ADMIN_NAME || 'Administrador',
  },

  // Initial e-mail settings, written once on first start. Afterwards they are managed in the back-office.
  seedEmail: {
    host: env.SMTP_HOST || '',
    port: Number(env.SMTP_PORT || 587),
    protocol: 'smtp',
    ssl: env.SMTP_SSL === 'true',
    ignoreCertificates: env.SMTP_IGNORE_CERTIFICATES === 'true',
    user: env.SMTP_USER || '',
    password: env.SMTP_PASSWORD || '',
    fromAddress: env.SMTP_FROM || '',
  },

  seedBranding: {
    projectTitle: env.PROJECT_TITLE || 'Projeto Base',
    clientName: env.CLIENT_NAME || 'ENSO',
  },
};

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { query } from '../db.js';

export const SESSION_COOKIE = 'session';
export const OTP_PENDING_COOKIE = 'otp_pending';

export const ROLES = ['super_admin', 'admin', 'normal'];
export const ADMIN_ROLES = ['super_admin', 'admin'];

const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: config.cookieSecure,
  path: '/',
  maxAge: maxAgeMs,
});

export function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    active: row.active,
    otpEnabled: row.otp_enabled,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export async function startSession(res, user) {
  const token = jwt.sign({ sub: user.id, tv: user.token_version, purpose: 'session' }, config.appSecret, {
    expiresIn: `${config.sessionHours}h`,
  });
  res.cookie(SESSION_COOKIE, token, cookieOptions(config.sessionHours * 3600 * 1000));
  res.clearCookie(OTP_PENDING_COOKIE, { path: '/' });
  await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
}

// Issued after a correct password when the user has OTP enabled; only good for the OTP step.
export function startOtpChallenge(res, user) {
  const token = jwt.sign({ sub: user.id, purpose: 'otp' }, config.appSecret, { expiresIn: '5m' });
  res.cookie(OTP_PENDING_COOKIE, token, cookieOptions(5 * 60 * 1000));
}

export function readOtpChallenge(req) {
  try {
    const payload = jwt.verify(req.cookies?.[OTP_PENDING_COOKIE] || '', config.appSecret);
    return payload.purpose === 'otp' ? payload.sub : null;
  } catch {
    return null;
  }
}

export function endSession(res) {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.clearCookie(OTP_PENDING_COOKIE, { path: '/' });
}

export async function requireAuth(req, res, next) {
  let payload;
  try {
    payload = jwt.verify(req.cookies?.[SESSION_COOKIE] || '', config.appSecret);
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
  if (payload.purpose !== 'session') return res.status(401).json({ error: 'Sessão inválida ou expirada.' });

  const { rows } = await query('SELECT * FROM users WHERE id = $1', [payload.sub]);
  const user = rows[0];
  if (!user || !user.active || user.token_version !== payload.tv) {
    endSession(res);
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
  req.user = user;
  next();
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) return res.status(403).json({ error: 'Acesso negado.' });
  next();
};

export const requireAdmin = [requireAuth, requireRole(...ADMIN_ROLES)];

// Admins manage admins and normal users; only a super admin can grant or manage super admin.
export function canManageRole(actorRole, targetRole) {
  if (actorRole === 'super_admin') return ROLES.includes(targetRole);
  if (actorRole === 'admin') return targetRole === 'admin' || targetRole === 'normal';
  return false;
}

export const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 8) return 'A password deve ter pelo menos 8 caracteres.';
  if (password.length > 200) return 'A password é demasiado longa.';
  return null;
}

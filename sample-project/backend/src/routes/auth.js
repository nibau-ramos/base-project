import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { passwordResetEmail } from '../emails/templates.js';
import {
  endSession,
  normalizeEmail,
  passwordProblem,
  publicUser,
  readOtpChallenge,
  requireAuth,
  startOtpChallenge,
  startSession,
} from '../lib/auth.js';
import { getBranding } from '../lib/branding.js';
import { sendSystemEmail } from '../lib/mailer.js';
import { confirmEnrollment, startEnrollment, verifyOtp } from '../lib/otp.js';
import { createResetLink, findValidResetToken } from '../lib/resetTokens.js';

const router = Router();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

// Compared against when the e-mail is unknown, so response time doesn't reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const INVALID_LOGIN = 'E-mail ou password inválidos.';
const RESET_SENT =
  'Se o e-mail indicado estiver registado, irá receber em breve uma mensagem com instruções para redefinir a password.';

router.post('/login', limiter, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  const ok = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
  if (!user || !ok || !user.active) return res.status(401).json({ error: INVALID_LOGIN });

  if (user.otp_enabled) {
    startOtpChallenge(res, user);
    return res.json({ otpRequired: true });
  }
  if (user.otp_required) {
    // An admin made OTP mandatory and it isn't set up yet: no session until it is (see /otp/setup below).
    startOtpChallenge(res, user, 15);
    return res.json({ otpSetupRequired: true });
  }
  await startSession(res, user);
  res.json({ user: publicUser(user) });
});

const CHALLENGE_EXPIRED = 'O pedido expirou. Volte a introduzir o e-mail e a password.';

async function challengedUser(req) {
  const userId = readOtpChallenge(req);
  if (!userId) return null;
  const { rows } = await query('SELECT * FROM users WHERE id = $1 AND active', [userId]);
  return rows[0] || null;
}

router.post('/otp', limiter, async (req, res) => {
  const user = await challengedUser(req);
  if (!user) return res.status(401).json({ error: CHALLENGE_EXPIRED });
  if (!user.otp_enabled || !verifyOtp(user.otp_secret, req.body?.code)) {
    return res.status(401).json({ error: 'Código inválido.' });
  }
  await startSession(res, user);
  res.json({ user: publicUser(user) });
});

// Forced setup during login. Only reachable with a password-verified challenge, and only for accounts
// that must have OTP but don't yet, so it can't be used to replace an existing OTP.
router.post('/otp/setup', limiter, async (req, res) => {
  const user = await challengedUser(req);
  if (!user) return res.status(401).json({ error: CHALLENGE_EXPIRED });
  if (!user.otp_required || user.otp_enabled) return res.status(400).json({ error: 'Pedido inválido.' });
  res.json(await startEnrollment(user));
});

router.post('/otp/setup/confirm', limiter, async (req, res) => {
  const user = await challengedUser(req);
  if (!user) return res.status(401).json({ error: CHALLENGE_EXPIRED });
  if (!user.otp_required || user.otp_enabled) return res.status(400).json({ error: 'Pedido inválido.' });
  const updated = await confirmEnrollment(user, req.body?.code);
  if (!updated) return res.status(400).json({ error: 'Código inválido.' });
  await startSession(res, updated);
  res.json({ user: publicUser(updated) });
});

router.post('/logout', (req, res) => {
  endSession(res);
  res.status(204).end();
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post('/forgot-password', limiter, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const { rows } = await query('SELECT * FROM users WHERE email = $1 AND active', [email]);
  const user = rows[0];

  if (user) {
    try {
      const reset = await createResetLink(user.id, 1);
      await sendSystemEmail(user.email, passwordResetEmail({ branding: await getBranding(), user, reset }));
    } catch (err) {
      // Same answer either way, so the form can't be used to discover accounts.
      console.error('Password reset e-mail failed:', err.message);
    }
  }
  res.json({ message: RESET_SENT });
});

router.get('/reset-password/:token', async (req, res) => {
  const row = await findValidResetToken(req.params.token);
  if (!row) return res.status(400).json({ error: 'Este link não é válido ou já expirou.' });
  res.json({ email: row.email });
});

router.post('/reset-password', limiter, async (req, res) => {
  const { token, password, confirmPassword } = req.body || {};
  const row = await findValidResetToken(token);
  if (!row) return res.status(400).json({ error: 'Este link não é válido ou já expirou.' });

  const problem = passwordProblem(password);
  if (problem) return res.status(400).json({ error: problem });
  if (password !== confirmPassword) return res.status(400).json({ error: 'A confirmação não coincide com a nova password.' });

  const hash = await bcrypt.hash(password, 12);
  await query('UPDATE users SET password_hash = $1, token_version = token_version + 1 WHERE id = $2', [hash, row.id]);
  // Using one link invalidates every outstanding link for that user.
  await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [row.id]);
  res.json({ message: 'Password atualizada. Já pode entrar com a nova password.' });
});

export default router;

import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { query } from '../db.js';
import { noticeEmail } from '../emails/templates.js';
import { getBranding } from '../lib/branding.js';
import { passwordProblem, publicUser, requireAuth, startSession } from '../lib/auth.js';
import { decrypt, encrypt } from '../lib/crypto.js';
import { sendSystemEmail } from '../lib/mailer.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => res.json({ user: publicUser(req.user) }));

router.put('/password', async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};
  if (!(await bcrypt.compare(String(currentPassword || ''), req.user.password_hash))) {
    return res.status(400).json({ error: 'A password atual está incorreta.' });
  }
  const problem = passwordProblem(newPassword);
  if (problem) return res.status(400).json({ error: problem });
  if (newPassword !== confirmPassword) return res.status(400).json({ error: 'A confirmação não coincide com a nova password.' });

  const hash = await bcrypt.hash(newPassword, 12);
  const { rows } = await query(
    'UPDATE users SET password_hash = $1, token_version = token_version + 1 WHERE id = $2 RETURNING *',
    [hash, req.user.id],
  );
  // Other sessions are now invalid; keep this one going with a fresh cookie.
  await startSession(res, rows[0]);

  sendSystemEmail(
    req.user.email,
    noticeEmail({
      user: req.user,
      heading: 'A sua password foi alterada',
      message: 'A password da sua conta foi alterada. Se não foi você, contacte de imediato o administrador.',
    }),
  ).catch((err) => console.warn('Password-changed notice not sent:', err.message));

  res.json({ message: 'Password alterada com sucesso.' });
});

// OTP setup is two-step: a pending secret is generated here and only becomes active after /otp/confirm.
router.post('/otp/setup', async (req, res) => {
  if (req.user.otp_enabled) return res.status(400).json({ error: 'O OTP já está ativo.' });
  const secret = authenticator.generateSecret();
  await query('UPDATE users SET otp_pending_secret = $1 WHERE id = $2', [encrypt(secret), req.user.id]);

  const { projectTitle } = await getBranding();
  const uri = authenticator.keyuri(req.user.email, projectTitle || 'Projeto Base', secret);
  res.json({ qr: await QRCode.toDataURL(uri, { margin: 1, width: 240 }), secret });
});

router.post('/otp/confirm', async (req, res) => {
  const pending = req.user.otp_pending_secret ? decrypt(req.user.otp_pending_secret) : null;
  const code = String(req.body?.code || '').replace(/\s/g, '');
  if (!pending) return res.status(400).json({ error: 'Comece por gerar um novo código QR.' });
  if (!authenticator.verify({ token: code, secret: pending })) return res.status(400).json({ error: 'Código inválido.' });

  const { rows } = await query(
    'UPDATE users SET otp_enabled = TRUE, otp_secret = otp_pending_secret, otp_pending_secret = NULL WHERE id = $1 RETURNING *',
    [req.user.id],
  );
  res.json({ user: publicUser(rows[0]) });
});

router.post('/otp/disable', async (req, res) => {
  if (!(await bcrypt.compare(String(req.body?.password || ''), req.user.password_hash))) {
    return res.status(400).json({ error: 'A password está incorreta.' });
  }
  const { rows } = await query(
    'UPDATE users SET otp_enabled = FALSE, otp_secret = NULL, otp_pending_secret = NULL WHERE id = $1 RETURNING *',
    [req.user.id],
  );
  res.json({ user: publicUser(rows[0]) });
});

export default router;

import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { query } from '../db.js';
import { noticeEmail } from '../emails/templates.js';
import { passwordProblem, publicUser, requireAuth, startSession } from '../lib/auth.js';
import { sendSystemEmail } from '../lib/mailer.js';
import { clearOtp, confirmEnrollment, startEnrollment } from '../lib/otp.js';

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

// OTP setup is two-step (see lib/otp.js): /otp/setup creates a pending secret, /otp/confirm activates it.
router.post('/otp/setup', async (req, res) => {
  if (req.user.otp_enabled) return res.status(400).json({ error: 'O OTP já está ativo.' });
  res.json(await startEnrollment(req.user));
});

router.post('/otp/confirm', async (req, res) => {
  if (!req.user.otp_pending_secret) return res.status(400).json({ error: 'Comece por gerar um novo código QR.' });
  const updated = await confirmEnrollment(req.user, req.body?.code);
  if (!updated) return res.status(400).json({ error: 'Código inválido.' });
  res.json({ user: publicUser(updated) });
});

router.post('/otp/disable', async (req, res) => {
  if (req.user.otp_required) {
    return res.status(403).json({ error: 'O OTP é obrigatório para esta conta e não pode ser desativado.' });
  }
  if (!(await bcrypt.compare(String(req.body?.password || ''), req.user.password_hash))) {
    return res.status(400).json({ error: 'A password está incorreta.' });
  }
  res.json({ user: publicUser(await clearOtp(req.user.id)) });
});

export default router;

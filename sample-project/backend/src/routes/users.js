import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { config } from '../config.js';
import { query } from '../db.js';
import { noticeEmail, welcomeEmail } from '../emails/templates.js';
import { getBranding } from '../lib/branding.js';
import {
  canManageRole,
  isValidEmail,
  normalizeEmail,
  passwordProblem,
  publicUser,
  requireAdmin,
} from '../lib/auth.js';
import { randomToken } from '../lib/crypto.js';
import { EmailNotConfiguredError, isEmailConfigured, sendSystemEmail } from '../lib/mailer.js';
import { clearOtp } from '../lib/otp.js';
import { createResetLink } from '../lib/resetTokens.js';

const router = Router();
router.use(requireAdmin);

async function loadTarget(req, res) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [Number(req.params.id)]);
  const target = rows[0];
  if (!target) {
    res.status(404).json({ error: 'Utilizador não encontrado.' });
    return null;
  }
  if (!canManageRole(req.user.role, target.role)) {
    res.status(403).json({ error: 'Não tem permissão para gerir este utilizador.' });
    return null;
  }
  return target;
}

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM users ORDER BY created_at DESC');
  res.json({ users: rows.map(publicUser) });
});

router.get('/:id', async (req, res) => {
  const target = await loadTarget(req, res);
  if (target) res.json({ user: publicUser(target) });
});

router.post('/', async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const name = String(req.body?.name || '').trim();
  const role = req.body?.role;
  const password = req.body?.password || '';

  if (!isValidEmail(email)) return res.status(400).json({ error: 'Indique um e-mail válido.' });
  if (!canManageRole(req.user.role, role)) return res.status(400).json({ error: 'Perfil inválido.' });
  if (password) {
    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ error: problem });
  }

  // Without a password the account can only be entered after a reset (e.g. via the welcome e-mail).
  const hash = await bcrypt.hash(password || randomToken(), 12);
  try {
    const { rows } = await query(
      'INSERT INTO users (email, name, role, password_hash, otp_required) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, name, role, hash, Boolean(req.body?.otpRequired)],
    );
    res.status(201).json({ user: publicUser(rows[0]) });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Já existe um utilizador com este e-mail.' });
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  const target = await loadTarget(req, res);
  if (!target) return;

  const name = req.body?.name === undefined ? target.name : String(req.body.name).trim();
  const role = req.body?.role ?? target.role;
  const active = req.body?.active ?? target.active;
  const otpRequired = Boolean(req.body?.otpRequired ?? target.otp_required);

  if (!canManageRole(req.user.role, role)) return res.status(400).json({ error: 'Perfil inválido.' });
  if (target.id === req.user.id && (role !== target.role || !active || otpRequired !== target.otp_required)) {
    return res.status(400).json({ error: 'Não pode alterar o seu próprio perfil, a obrigatoriedade do OTP nem desativar a sua conta.' });
  }

  // Making OTP mandatory for someone without it ends their sessions, so their next login goes through setup.
  const forceSetup = otpRequired && !target.otp_required && !target.otp_enabled;
  const { rows } = await query(
    `UPDATE users SET name = $1, role = $2, active = $3, otp_required = $4
       ${forceSetup ? ', token_version = token_version + 1' : ''}
     WHERE id = $5 RETURNING *`,
    [name, role, Boolean(active), otpRequired, target.id],
  );
  res.json({ user: publicUser(rows[0]) });
});

// For a lost phone: removes the user's OTP and ends their sessions. If OTP is mandatory they set it up
// again at the next login; otherwise they can log in with just the password and re-enable it in their profile.
router.post('/:id/otp/reset', async (req, res) => {
  const target = await loadTarget(req, res);
  if (!target) return;
  if (target.id === req.user.id) return res.status(400).json({ error: 'Gira o seu próprio OTP no seu perfil.' });

  const updated = await clearOtp(target.id, { bumpSessions: true });
  sendSystemEmail(
    target.email,
    noticeEmail({
      user: target,
      heading: 'A verificação em dois passos foi reposta',
      message: target.otp_required
        ? 'Um administrador repôs o OTP da sua conta. No próximo login vai ser-lhe pedido para o configurar de novo.'
        : 'Um administrador removeu o OTP da sua conta. Pode voltar a ativá-lo no seu perfil.',
    }),
  ).catch((err) => console.warn('OTP reset notice not sent:', err.message));

  res.json({ user: publicUser(updated), message: `OTP de ${target.email} reposto.` });
});

router.delete('/:id', async (req, res) => {
  const target = await loadTarget(req, res);
  if (!target) return;
  if (target.id === req.user.id) return res.status(400).json({ error: 'Não pode eliminar a sua própria conta.' });
  await query('DELETE FROM users WHERE id = $1', [target.id]);
  res.status(204).end();
});

router.post('/:id/welcome', async (req, res) => {
  const target = await loadTarget(req, res);
  if (!target) return;
  if (!(await isEmailConfigured())) return res.status(409).json({ error: new EmailNotConfiguredError().message });

  const includeReset = Boolean(req.body?.includeReset);
  const reset = includeReset ? await createResetLink(target.id, 72) : null;
  try {
    await sendSystemEmail(
      target.email,
      welcomeEmail({ branding: await getBranding(), user: target, reset, loginUrl: `${config.appUrl}/login` }),
    );
  } catch (err) {
    return res.status(502).json({ error: `Não foi possível enviar o e-mail: ${err.message}` });
  }
  res.json({ message: `E-mail de boas-vindas enviado para ${target.email}.` });
});

export default router;

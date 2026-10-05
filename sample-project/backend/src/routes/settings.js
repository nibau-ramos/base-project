import { Router } from 'express';
import multer from 'multer';
import { getSetting, query, setSetting } from '../db.js';
import { testEmail } from '../emails/templates.js';
import { isValidEmail, requireAdmin } from '../lib/auth.js';
import { getBranding } from '../lib/branding.js';
import { getEmailSettingsForApi, saveEmailSettings, sendSystemEmail } from '../lib/mailer.js';

const router = Router();
router.use(requireAdmin);

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } });

// --- E-mail ---

router.get('/email', async (req, res) => {
  res.json(await getEmailSettingsForApi());
});

router.put('/email', async (req, res) => {
  const b = req.body || {};
  const port = Number(b.port);
  if (!String(b.host || '').trim()) return res.status(400).json({ error: 'Indique o host.' });
  if (!Number.isInteger(port) || port < 1 || port > 65535) return res.status(400).json({ error: 'Indique uma porta válida.' });
  if (b.protocol !== 'smtp') return res.status(400).json({ error: 'Protocolo não suportado.' });
  if (!isValidEmail(String(b.fromAddress || '').trim())) return res.status(400).json({ error: 'Indique um e-mail de remetente válido.' });

  await saveEmailSettings({
    host: String(b.host),
    port,
    protocol: 'smtp',
    ssl: Boolean(b.ssl),
    ignoreCertificates: Boolean(b.ignoreCertificates),
    user: String(b.user || ''),
    fromAddress: String(b.fromAddress),
    password: b.clearPassword ? '' : b.password ? String(b.password) : undefined,
  });
  res.json(await getEmailSettingsForApi());
});

router.post('/email/test', async (req, res) => {
  const to = String(req.body?.to || req.user.email).trim();
  if (!isValidEmail(to)) return res.status(400).json({ error: 'Indique um e-mail de destino válido.' });
  try {
    await sendSystemEmail(to, testEmail({ branding: await getBranding() }));
    res.json({ message: `E-mail de teste enviado para ${to}.` });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// --- Branding ---

router.get('/branding', async (req, res) => {
  res.json(await getBranding());
});

router.put('/branding', async (req, res) => {
  const projectTitle = String(req.body?.projectTitle || '').trim();
  const clientName = String(req.body?.clientName || '').trim();
  if (!projectTitle) return res.status(400).json({ error: 'Indique o título do projeto.' });
  await setSetting('branding', { ...((await getSetting('branding')) || {}), projectTitle, clientName });
  res.json(await getBranding());
});

router.post('/branding/logo', upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Selecione um ficheiro.' });
  if (!LOGO_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Formato não suportado. Utilize PNG, JPG, SVG, WEBP ou ICO.' });
  }
  await query(
    `INSERT INTO branding_logo (id, data, mime, updated_at) VALUES (1, $1, $2, NOW())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, mime = EXCLUDED.mime, updated_at = NOW()`,
    [req.file.buffer, req.file.mimetype],
  );
  res.json(await getBranding());
});

router.delete('/branding/logo', async (req, res) => {
  await query('DELETE FROM branding_logo WHERE id = 1');
  res.json(await getBranding());
});

export default router;

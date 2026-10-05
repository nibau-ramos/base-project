import { Router } from 'express';
import { getBranding, getLogo } from '../lib/branding.js';

// Public: the login page, favicon and public front-end all need branding before anyone is authenticated.
const router = Router();

router.get('/', async (req, res) => {
  res.json(await getBranding());
});

router.get('/logo', async (req, res) => {
  const logo = await getLogo();
  if (!logo) return res.status(404).end();
  res.set({
    'Content-Type': logo.mime,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    // Uploaded SVGs may contain scripts; never let them run if opened directly.
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  });
  res.send(logo.data);
});

export default router;

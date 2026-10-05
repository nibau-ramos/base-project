import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.js';
import brandingRoutes from './routes/branding.js';
import profileRoutes from './routes/profile.js';
import settingsRoutes from './routes/settings.js';
import userRoutes from './routes/users.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // behind the front-end's nginx
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/branding', brandingRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/settings', settingsRoutes);

  app.use('/api', (req, res) => res.status(404).json({ error: 'Não encontrado.' }));

  app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'O ficheiro excede 1 MB.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Pedido inválido.' });
    console.error(err);
    res.status(500).json({ error: 'Ocorreu um erro inesperado.' });
  });

  return app;
}

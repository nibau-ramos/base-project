import bcrypt from 'bcryptjs';
import { createApp } from './app.js';
import { config } from './config.js';
import { getSetting, migrate, query, setSetting, waitForDatabase } from './db.js';
import { normalizeEmail } from './lib/auth.js';
import { saveEmailSettings } from './lib/mailer.js';

// First-run data only: once anything exists, the back-office owns it.
async function seed() {
  const { rows } = await query('SELECT COUNT(*)::int AS n FROM users');
  if (rows[0].n === 0) {
    const { email, password, name } = config.seedAdmin;
    await query("INSERT INTO users (email, name, role, password_hash) VALUES ($1, $2, 'super_admin', $3)", [
      normalizeEmail(email),
      name,
      await bcrypt.hash(password, 12),
    ]);
    console.log(`Created initial super administrator ${email}`);
  }
  if (!(await getSetting('email'))) await saveEmailSettings(config.seedEmail);
  if (!(await getSetting('branding'))) await setSetting('branding', config.seedBranding);
}

await waitForDatabase();
await migrate();
await seed();

createApp().listen(config.port, () => console.log(`Backend listening on port ${config.port}`));

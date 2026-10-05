import { config } from '../config.js';
import { query } from '../db.js';
import { randomToken, sha256 } from './crypto.js';

// Only the hash is stored; the raw token travels in the e-mailed link.
export async function createResetLink(userId, hours) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + hours * 3600 * 1000);
  await query('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [
    userId,
    sha256(token),
    expiresAt,
  ]);
  return { url: `${config.appUrl}/reset-password?token=${encodeURIComponent(token)}`, expiresAt };
}

/** Returns the token row joined with its user, or null if unknown, used, expired or the user is inactive. */
export async function findValidResetToken(token) {
  if (!token) return null;
  const { rows } = await query(
    `SELECT t.id AS token_id, u.*
       FROM password_reset_tokens t JOIN users u ON u.id = t.user_id
      WHERE t.token_hash = $1 AND t.used_at IS NULL AND t.expires_at > NOW() AND u.active`,
    [sha256(token)],
  );
  return rows[0] || null;
}

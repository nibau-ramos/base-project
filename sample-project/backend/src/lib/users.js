import { query } from '../db.js';

// Every user read that ends up in an API response goes through these, so `passkey_count` is always present.
const USER_SELECT = `SELECT u.*, (SELECT COUNT(*) FROM webauthn_credentials c WHERE c.user_id = u.id)::int AS passkey_count
                       FROM users u`;

export async function findUserById(id) {
  const { rows } = await query(`${USER_SELECT} WHERE u.id = $1`, [id]);
  return rows[0] || null;
}

export async function findUserByEmail(email) {
  const { rows } = await query(`${USER_SELECT} WHERE u.email = $1`, [email]);
  return rows[0] || null;
}

export async function listUsers() {
  const { rows } = await query(`${USER_SELECT} ORDER BY u.created_at DESC`);
  return rows;
}

/** True when the user has at least one second factor set up. Needs a row from the functions above. */
export const hasMfa = (user) => Boolean(user.otp_enabled || user.passkey_count > 0);

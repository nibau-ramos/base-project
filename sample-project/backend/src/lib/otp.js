import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { query } from '../db.js';
import { getBranding } from './branding.js';
import { decrypt, encrypt } from './crypto.js';
import { findUserById } from './users.js';

const cleanCode = (code) => String(code || '').replace(/\s/g, '');

/** Checks a code against an encrypted secret (as stored in otp_secret / otp_pending_secret). */
export function verifyOtp(encryptedSecret, code) {
  if (!encryptedSecret) return false;
  return authenticator.verify({ token: cleanCode(code), secret: decrypt(encryptedSecret) });
}

// Enrollment is two-step: a pending secret is stored here and only becomes active in confirmEnrollment,
// so a half-finished setup never locks anyone out. Used from the profile and from the forced setup at login.
export async function startEnrollment(user) {
  const secret = authenticator.generateSecret();
  await query('UPDATE users SET otp_pending_secret = $1 WHERE id = $2', [encrypt(secret), user.id]);
  const { projectTitle } = await getBranding();
  const uri = authenticator.keyuri(user.email, projectTitle || 'Projeto Base', secret);
  return { qr: await QRCode.toDataURL(uri, { margin: 1, width: 240 }), secret };
}

/** Returns the updated user, or null when the code doesn't match the pending secret. */
export async function confirmEnrollment(user, code) {
  if (!verifyOtp(user.otp_pending_secret, code)) return null;
  await query('UPDATE users SET otp_enabled = TRUE, otp_secret = otp_pending_secret, otp_pending_secret = NULL WHERE id = $1', [
    user.id,
  ]);
  return findUserById(user.id);
}

/** Removes TOTP (the user disabling it). */
export async function clearOtp(userId) {
  await query('UPDATE users SET otp_enabled = FALSE, otp_secret = NULL, otp_pending_secret = NULL WHERE id = $1', [userId]);
  return findUserById(userId);
}

/** Admin reset (lost phone/computer): removes TOTP and every WebAuthn credential, and ends open sessions. */
export async function resetMfa(userId) {
  await query('DELETE FROM webauthn_credentials WHERE user_id = $1', [userId]);
  await query(
    `UPDATE users SET otp_enabled = FALSE, otp_secret = NULL, otp_pending_secret = NULL, token_version = token_version + 1
     WHERE id = $1`,
    [userId],
  );
  return findUserById(userId);
}

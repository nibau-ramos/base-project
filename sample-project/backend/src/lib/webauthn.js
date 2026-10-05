import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { query } from '../db.js';
import { getBranding } from './branding.js';

// WebAuthn ("impressão digital" via Touch ID / Windows Hello) as a second factor next to TOTP.
// The challenge of each ceremony lives in a short-lived signed cookie, so the server keeps no extra state.

const CHALLENGE_COOKIE = 'webauthn_challenge';

function rememberChallenge(res, user, kind, challenge) {
  const token = jwt.sign({ sub: user.id, kind, challenge, purpose: 'webauthn' }, config.appSecret, { expiresIn: '5m' });
  res.cookie(CHALLENGE_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    path: '/api',
    maxAge: 5 * 60 * 1000,
  });
}

/** Returns the stored challenge for this user and ceremony, and clears it (one use only). */
function takeChallenge(req, res, user, kind) {
  res.clearCookie(CHALLENGE_COOKIE, { path: '/api' });
  try {
    const payload = jwt.verify(req.cookies?.[CHALLENGE_COOKIE] || '', config.appSecret);
    if (payload.purpose === 'webauthn' && payload.kind === kind && payload.sub === user.id) return payload.challenge;
  } catch {
    // expired or tampered
  }
  return null;
}

async function credentialsOf(userId) {
  const { rows } = await query('SELECT * FROM webauthn_credentials WHERE user_id = $1 ORDER BY created_at', [userId]);
  return rows;
}

export async function listPasskeys(userId) {
  return (await credentialsOf(userId)).map((c) => ({
    id: c.id,
    name: c.name,
    deviceType: c.device_type,
    backedUp: c.backed_up,
    createdAt: c.created_at,
    lastUsedAt: c.last_used_at,
  }));
}

export async function registrationOptions(res, user) {
  const existing = await credentialsOf(user.id);
  const { projectTitle } = await getBranding();
  const options = await generateRegistrationOptions({
    rpName: projectTitle || 'Projeto Base',
    rpID: config.webauthn.rpId,
    userName: user.email,
    userDisplayName: user.name || user.email,
    userID: new TextEncoder().encode(`user:${user.id}`),
    attestationType: 'none',
    excludeCredentials: existing.map((c) => ({ id: c.credential_id, transports: c.transports })),
    // The computer's own sensor (Touch ID, Windows Hello…), with user verification = fingerprint/PIN required.
    authenticatorSelection: { authenticatorAttachment: 'platform', residentKey: 'preferred', userVerification: 'required' },
  });
  rememberChallenge(res, user, 'register', options.challenge);
  return options;
}

/** Verifies and stores a new credential. Returns an error message, or null on success. */
export async function finishRegistration(req, res, user, response, name) {
  const expectedChallenge = takeChallenge(req, res, user, 'register');
  if (!expectedChallenge) return 'O pedido expirou. Tente novamente.';

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: config.webauthn.origin,
      expectedRPID: config.webauthn.rpId,
      requireUserVerification: true,
    });
  } catch (err) {
    console.warn('WebAuthn registration rejected:', err.message);
    return 'Não foi possível registar a impressão digital.';
  }
  if (!verification.verified) return 'Não foi possível registar a impressão digital.';

  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  await query(
    `INSERT INTO webauthn_credentials (user_id, credential_id, public_key, counter, transports, name, device_type, backed_up)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      user.id,
      credential.id,
      Buffer.from(credential.publicKey),
      credential.counter,
      credential.transports ?? [],
      String(name || '').trim().slice(0, 60) || 'Este computador',
      credentialDeviceType,
      credentialBackedUp,
    ],
  );
  return null;
}

export async function authenticationOptions(res, user) {
  const existing = await credentialsOf(user.id);
  const options = await generateAuthenticationOptions({
    rpID: config.webauthn.rpId,
    allowCredentials: existing.map((c) => ({ id: c.credential_id, transports: c.transports })),
    userVerification: 'required',
  });
  rememberChallenge(res, user, 'login', options.challenge);
  return options;
}

/** True when the response proves possession of one of the user's credentials (with fingerprint/PIN). */
export async function finishAuthentication(req, res, user, response) {
  const expectedChallenge = takeChallenge(req, res, user, 'login');
  if (!expectedChallenge || !response?.id) return false;

  const { rows } = await query('SELECT * FROM webauthn_credentials WHERE user_id = $1 AND credential_id = $2', [
    user.id,
    response.id,
  ]);
  const stored = rows[0];
  if (!stored) return false;

  try {
    const { verified, authenticationInfo } = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: config.webauthn.origin,
      expectedRPID: config.webauthn.rpId,
      credential: {
        id: stored.credential_id,
        publicKey: new Uint8Array(stored.public_key),
        counter: Number(stored.counter),
        transports: stored.transports,
      },
      requireUserVerification: true,
    });
    if (!verified) return false;
    await query('UPDATE webauthn_credentials SET counter = $1, last_used_at = NOW() WHERE id = $2', [
      authenticationInfo.newCounter,
      stored.id,
    ]);
    return true;
  } catch (err) {
    console.warn('WebAuthn authentication rejected:', err.message);
    return false;
  }
}

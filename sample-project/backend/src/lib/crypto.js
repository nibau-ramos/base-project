import crypto from 'node:crypto';
import { config } from '../config.js';

const key = crypto.createHash('sha256').update(config.appSecret).digest();

// AES-256-GCM for secrets that must be recoverable (SMTP password, OTP secrets).
export function encrypt(plain) {
  if (plain === null || plain === undefined || plain === '') return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', iv.toString('base64'), tag.toString('base64'), data.toString('base64')].join(':');
}

export function decrypt(payload) {
  if (!payload) return '';
  const [version, iv, tag, data] = payload.split(':');
  if (version !== 'v1') throw new Error('Unknown secret format');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
}

export const randomToken = () => crypto.randomBytes(32).toString('base64url');

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

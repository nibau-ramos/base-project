import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decrypt, encrypt } from '../src/lib/crypto.js';

test('encrypt/decrypt round-trips and does not store plain text', () => {
  const secret = 'smtp-password-123';
  const enc = encrypt(secret);
  assert.ok(!enc.includes(secret));
  assert.equal(decrypt(enc), secret);
});

test('empty secrets are stored as null', () => {
  assert.equal(encrypt(''), null);
  assert.equal(decrypt(null), '');
});

test('tampered ciphertext is rejected', () => {
  const parts = encrypt('abc').split(':');
  parts[3] = Buffer.from('xyz').toString('base64');
  assert.throws(() => decrypt(parts.join(':')));
});

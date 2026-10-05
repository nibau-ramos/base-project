import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate } from '../src/lib/dates.js';

const sample = '2026-10-05T14:30:15';

test('formats date only as YYYY/MM/DD', () => {
  assert.equal(formatDate(sample), '2026/10/05');
});

test('formats date and time as YYYY/MM/DD hh:mm', () => {
  assert.equal(formatDate(sample, 'datetime'), '2026/10/05 14:30');
});

test('formats date, time and seconds as YYYY/MM/DD hh:mm:ss', () => {
  assert.equal(formatDate(sample, 'datetime-seconds'), '2026/10/05 14:30:15');
});

test('returns empty string for missing or invalid values', () => {
  assert.equal(formatDate(null), '');
  assert.equal(formatDate(''), '');
  assert.equal(formatDate('not a date'), '');
});

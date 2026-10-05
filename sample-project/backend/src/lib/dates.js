// ENSO date format: YYYY/MM/DD, optionally followed by hh:mm or hh:mm:ss.
// This is the only date format allowed in the UI and in e-mails.

const pad = (n) => String(n).padStart(2, '0');

/**
 * @param {Date|string|number|null|undefined} value
 * @param {'date'|'datetime'|'datetime-seconds'} precision
 */
export function formatDate(value, precision = 'date') {
  if (value === null || value === undefined || value === '') return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const date = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
  if (precision === 'date') return date;

  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (precision === 'datetime') return `${date} ${time}`;

  return `${date} ${time}:${pad(d.getSeconds())}`;
}

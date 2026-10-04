const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;

export function sanitizeText(value) {
  if (typeof value !== 'string') return value;

  return value
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAGS, '')
    .replace(/[<>]/g, '')
    .trim();
}

export function sanitizeObject(input) {
  if (Array.isArray(input)) return input.map(sanitizeObject);

  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeObject(value)])
    );
  }

  return sanitizeText(input);
}

export function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
}

export default function sanitizeAddress(address: string): string {
  let sanitized = address;

  if (!sanitized.startsWith('http://')) {
    sanitized = `http://${sanitized}`;
  }

  if (sanitized.endsWith('/')) {
    sanitized = sanitized.substring(0, sanitized.length - 1);
  }

  return sanitized.trim();
}

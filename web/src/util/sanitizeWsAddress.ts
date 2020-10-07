export default function sanitizeWsAddress(address: string): string {
  let sanitized = address.trim();

  if (!sanitized.startsWith('ws://')) {
    sanitized = `ws://${sanitized}`;
  }

  return sanitized;
}

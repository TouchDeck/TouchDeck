export function getExtension(path: string): string {
  const lastIndex = path.lastIndexOf('.');
  return lastIndex >= 0 ? path.substring(lastIndex + 1) : '';
}

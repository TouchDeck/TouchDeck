export function removeExtension(path?: string): string {
  if (!path) {
    return '';
  }

  const lastIndex = path.lastIndexOf('.');
  return lastIndex >= 0 ? path.substring(0, lastIndex) : path;
}

export default function removeExtension(path: string): string {
  const lastIndex = path.lastIndexOf('.');
  return lastIndex ? path.substring(0, lastIndex) : path;
}

import { resolve } from 'path';

/**
 * Assert that the given relative path resolves to a file in the given directory.
 * Returns the absolute path, or throws an error if it resolves to a file outside of the directory.
 *
 * @param baseDir The directory to resolve the path in.
 * @param relativePath The relative path to resolve.
 */
export function assertInDir(baseDir: string, relativePath: string): string {
  const path = resolve(baseDir, relativePath);

  if (!path.startsWith(baseDir)) {
    throw new Error(`Path is not in base directory: ${relativePath}`);
  }

  return path;
}

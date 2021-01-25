import { resolve } from 'path';
import { IMAGES_DIR } from '../constants';

/**
 * Assert that the given relative path resolves to a file in the {@link IMAGES_DIR}.
 * Returns the absolute path, or throws an error if it resolves to a file outside of the directory.
 *
 * @param relativePath The relative path to resolve
 */
export function assertInImagesDir(relativePath: string): string {
  const path = resolve(IMAGES_DIR, relativePath);

  if (!path.startsWith(IMAGES_DIR)) {
    throw new Error(`Path is not in images directory: ${relativePath}`);
  }

  return path;
}

import { resolve } from 'path';
import { IMAGES_DIR } from '../constants';

export function assertInImagesDir(relativePath: string): string {
  const path = resolve(IMAGES_DIR, relativePath);

  if (!path.startsWith(IMAGES_DIR)) {
    throw new Error(`Path is not in images directory: ${relativePath}`);
  }

  return path;
}

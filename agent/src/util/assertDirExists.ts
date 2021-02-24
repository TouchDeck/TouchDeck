import { promises as fs } from 'fs';

/**
 * Assert that a directory exists, creating it if it doesn't.
 *
 * @param path The path of the directory.
 */
export async function assertDirExists(path: string): Promise<void> {
  await fs.stat(path).catch(() => fs.mkdir(path));
}

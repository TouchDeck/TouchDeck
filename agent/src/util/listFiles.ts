import { promises as fs } from 'fs';
import { relative } from 'path';

async function listFilesRecursive(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir);

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = `${dir}/${entry}`;
      const isFile = (await fs.stat(entryPath)).isFile();
      if (isFile) {
        files.push(entryPath);
      } else {
        const subEntries = await listFilesRecursive(entryPath);
        files.push(...subEntries);
      }
    })
  );

  return files;
}

/**
 * List all files in a directory, recursively.
 * This also normalizes slashes by replacing all `\` with `/`.
 *
 * @param dir The directory to read.
 */
export default async function listFiles(dir: string): Promise<string[]> {
  const files = await listFilesRecursive(dir);
  return files.map((f) => relative(dir, f).replace(/\\/g, '/'));
}

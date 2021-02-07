import { Path, TemplateInfo } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import listFiles from '../util/listFiles';
import { IMAGES_DIR, TEMPLATES_DIR } from '../constants';
import { assertInDir } from '../util/assertInDir';

export async function getTemplates(): Promise<TemplateInfo[]> {
  const entries = await listFiles(TEMPLATES_DIR);

  return Promise.all(
    entries.map(async (path) => {
      const fileBuffer = await fs.readFile(resolve(IMAGES_DIR, path));
      return {
        path,
        text: fileBuffer.toString(),
        values: {}, // TODO
      };
    })
  );
}

export async function deleteTemplate({ path }: Path): Promise<void> {
  await fs.unlink(assertInDir(TEMPLATES_DIR, path));
}

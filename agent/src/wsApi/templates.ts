import { Path, TemplateInfo } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import listFiles from '../util/listFiles';
import { TEMPLATES_DIR } from '../constants';
import { assertInDir } from '../util/assertInDir';

interface Template {
  text: string;
  values: Record<string, unknown>;
}

export async function getTemplates(): Promise<TemplateInfo[]> {
  const entries = await listFiles(TEMPLATES_DIR);

  return Promise.all(
    entries.map(async (path) => {
      const contentString = (
        await fs.readFile(resolve(TEMPLATES_DIR, path))
      ).toString();
      const parsed: Template = JSON.parse(contentString);
      return {
        path,
        text: parsed.text,
        values: parsed.values,
      };
    })
  );
}

export async function deleteTemplate({ path }: Path): Promise<void> {
  await fs.unlink(assertInDir(TEMPLATES_DIR, path));
}

import { Template } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import listFiles from '../../util/listFiles';
import { TEMPLATES_DIR } from '../../constants';
import { singleton } from '../../Injector';

@singleton
export class TemplateManager {
  private templatesByPath: Record<string, Template> = {};

  public get templates(): Record<string, Template> {
    return this.templatesByPath;
  }

  public async load(): Promise<void> {
    const entries = await listFiles(TEMPLATES_DIR);

    const loaded: Record<string, Template> = {};
    await Promise.all(
      entries.map(async (path) => {
        // Read the template file content.
        const contentString = (
          await fs.readFile(resolve(TEMPLATES_DIR, path))
        ).toString();

        // Parse the template.
        // TODO: Validate the template.
        const parsed: Template = JSON.parse(contentString);

        loaded[path] = {
          text: parsed.text,
          values: parsed.values,
        };
      })
    );
    this.templatesByPath = loaded;
  }
}

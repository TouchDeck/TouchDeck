import { Template } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import Mustache from 'mustache';
import { Logger } from '@luca_scorpion/tinylogger';
import listFiles from '../../util/listFiles';
import { TEMPLATES_DIR, TEMPLATES_OUTPUT_DIR } from '../../constants';
import { singleton } from '../../Injector';
import { assertInDir } from '../../util/assertInDir';
import removeExtension from '../../util/removeExtension';

@singleton
export class TemplateManager {
  private static readonly log = new Logger(TemplateManager.name);

  private templatesByPath: Record<string, Template> = {};

  public get templates(): Record<string, Template> {
    return this.templatesByPath;
  }

  /**
   * Load all templates from the {@link TEMPLATES_DIR}.
   * This will also {@link render} all of them.
   */
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

    // Render all templates.
    await Promise.all(
      Object.keys(this.templates).map((path) => this.render(path))
    );
  }

  /**
   * Render a template to {@link TEMPLATES_OUTPUT_DIR}.
   *
   * @param templatePath The path of the template to render.
   */
  public async render(templatePath: string): Promise<void> {
    TemplateManager.log.debug(`Rendering: ${templatePath}`);
    const template = this.getTemplate(templatePath);
    const rendered = Mustache.render(template.text, template.values);
    const outputPath = `${removeExtension(templatePath)}.txt`;
    await fs.writeFile(assertInDir(TEMPLATES_OUTPUT_DIR, outputPath), rendered);
  }

  private getTemplate(path: string): Template {
    const template = this.templates[path];
    if (!template) {
      throw new Error(`No template found with path: ${path}`);
    }
    return template;
  }
}

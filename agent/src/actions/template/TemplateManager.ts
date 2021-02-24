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
   * Get a template.
   * This throws an error if the template does not exist.
   *
   * @param path The template path.
   */
  public getTemplate(path: string): Template {
    const template = this.templates[path];
    if (!template) {
      throw new Error(`No template found with path: ${path}`);
    }
    return template;
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
      Object.entries(this.templates).map(([path, template]) =>
        this.render(path, template)
      )
    );
  }

  /**
   * Set a view value for a template.
   *
   * @param path The template path.
   * @param key The view key.
   * @param value The view value to set.
   */
  public async setValue(
    path: string,
    key: string,
    value: string | number
  ): Promise<void> {
    const template = this.getTemplate(path);
    template.values[key] = value;
    await this.store(path, template);
  }

  /**
   * Delete a template.
   * This also deletes the rendered file.
   *
   * @param path The path of the template to delete.
   */
  public async delete(path: string): Promise<void> {
    await fs.unlink(assertInDir(TEMPLATES_DIR, path));
    const outputPath = `${removeExtension(path)}.txt`;
    await fs.unlink(assertInDir(TEMPLATES_OUTPUT_DIR, outputPath));
    delete this.templatesByPath[path];
  }

  /**
   * Store a template.
   * This will store it in the templates registry, write it to disk, and render it.
   *
   * @param path The template path.
   * @param template The template value.
   */
  public async store(path: string, template: Template): Promise<void> {
    this.templatesByPath[path] = template;
    await Promise.all([this.render(path, template), this.save(path, template)]);
  }

  /**
   * Render a template to {@link TEMPLATES_OUTPUT_DIR}.
   *
   * @param path The path of the template to render.
   * @param template The template value.
   */
  private async render(path: string, template: Template): Promise<void> {
    TemplateManager.log.debug(`Rendering: ${path}`);
    const rendered = Mustache.render(template.text, template.values);
    const outputPath = `${removeExtension(path)}.txt`;
    await fs.writeFile(assertInDir(TEMPLATES_OUTPUT_DIR, outputPath), rendered);
  }

  /**
   * Save a template to {@link TEMPLATES_DIR}.
   *
   * @param path The template path.
   * @param template The template value.
   */
  private async save(path: string, template: Template): Promise<void> {
    await fs.writeFile(
      assertInDir(TEMPLATES_DIR, path),
      JSON.stringify(template, null, 2)
    );
  }
}

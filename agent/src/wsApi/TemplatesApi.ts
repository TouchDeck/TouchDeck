import { Path, TemplateInfo, UpsertTemplate } from 'touchdeck-model';
import { TemplateManager } from '../actions/template/TemplateManager';
import { singleton } from '../Injector';

@singleton
export class TemplatesApi {
  public constructor(private readonly templates: TemplateManager) {
    this.getTemplates = this.getTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.upsertTemplate = this.upsertTemplate.bind(this);
  }

  public async getTemplates(): Promise<TemplateInfo[]> {
    return Object.entries(this.templates.templates).map(([path, template]) => ({
      path,
      ...template,
    }));
  }

  public async deleteTemplate({ path }: Path): Promise<void> {
    await this.templates.delete(path);
  }

  public async upsertTemplate({
    path,
    template,
  }: UpsertTemplate): Promise<void> {
    // Store the new template.
    await this.templates.store(template.path, {
      text: template.text,
      values: template.values,
    });

    // If the template was renamed, delete the old one.
    if (path && path !== template.path) {
      await this.templates.delete(path);
    }
  }
}

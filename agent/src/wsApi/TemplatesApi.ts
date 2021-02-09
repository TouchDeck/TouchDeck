import { Path, TemplateInfo } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { TEMPLATES_DIR } from '../constants';
import { assertInDir } from '../util/assertInDir';
import { TemplateManager } from '../actions/template/TemplateManager';
import { singleton } from '../Injector';

@singleton
export class TemplatesApi {
  public constructor(private readonly templates: TemplateManager) {
    this.getTemplates = this.getTemplates.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  }

  public async getTemplates(): Promise<TemplateInfo[]> {
    return Object.entries(this.templates.templates).map(([path, template]) => ({
      path,
      ...template,
    }));
  }

  public async deleteTemplate({ path }: Path): Promise<void> {
    await fs.unlink(assertInDir(TEMPLATES_DIR, path));
  }
}

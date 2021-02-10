import { action, Action, param, PreparedAction } from '../Action';
import { TemplateManager } from './TemplateManager';

@action('Template', 'Set Value')
export default class TemplateSetValueAction implements Action {
  public constructor(private readonly templates: TemplateManager) {}

  public prepare(
    @param('template') template: string,
    @param('key') key: string,
    @param('value') value: string
  ): PreparedAction {
    return {
      invoke: () => this.invoke(template, key, value),
    };
  }

  private async invoke(
    template: string,
    key: string,
    value: string
  ): Promise<void> {
    await this.templates.setValue(template, key, value);
  }
}

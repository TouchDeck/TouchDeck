import { action, Action, param, PreparedAction } from '../Action';
import { TemplateManager } from './TemplateManager';

@action('Template', 'Change Value')
export default class TemplateChangeValueAction implements Action {
  public constructor(private readonly templates: TemplateManager) {}

  public prepare(
    @param('template') template: string,
    @param('key') key: string,
    @param('change') change: number
  ): PreparedAction {
    return {
      invoke: () => this.invoke(template, key, change),
    };
  }

  private async invoke(
    template: string,
    key: string,
    change: number
  ): Promise<void> {
    const rawValue = this.templates.getTemplate(template).values[key];
    let oldValue: number;

    // Parse the old value to a number.
    if (typeof rawValue === 'number') {
      oldValue = rawValue;
    } else if (typeof rawValue === 'string') {
      oldValue = parseInt(rawValue, 10);
    } else {
      oldValue = 0;
    }

    await this.templates.setValue(template, key, oldValue + change);
  }
}

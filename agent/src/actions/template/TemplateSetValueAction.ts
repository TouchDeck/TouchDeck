import { action, Action, param, PreparedAction } from '../Action';

@action('Template', 'Set Value')
export default class TemplateSetValueAction implements Action {
  public prepare(
    @param('template') template: string,
    @param('value') value: string
  ): PreparedAction {
    return {
      invoke: () => this.invoke(template, value),
    };
  }

  private async invoke(template: string, value: string): Promise<void> {
    // TODO
  }
}

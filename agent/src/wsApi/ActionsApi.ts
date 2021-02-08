import { singleton } from '../Injector';
import { ActionOption } from '../../../model';
import { ActionRegistry } from '../actions/ActionRegistry';

@singleton
export class ActionsApi {
  public constructor(private readonly registry: ActionRegistry) {
    this.getActionOptions = this.getActionOptions.bind(this);
  }

  public getActionOptions(): ActionOption[] {
    return this.registry.getAvailableActions().map((action) => {
      const option: Partial<ActionOption> = {
        type: action.constructor.name,
        category: action.category,
        name: action.name,
        parameters: action.parameters,
        toggleable: action.toggleable,
      };

      if (option.toggleable && action.toggleable) {
        option.toggleInfo = action.toggleInfo;
      }

      return option as ActionOption;
    });
  }
}

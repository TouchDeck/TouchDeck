import { ActionOption } from 'touchdeck-model';
import { ActionRegistry } from '../actions/ActionRegistry';

export function getActionOptions(
  registry: ActionRegistry
): () => ActionOption[] {
  return () =>
    registry.getAvailableActions().map((action) => {
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

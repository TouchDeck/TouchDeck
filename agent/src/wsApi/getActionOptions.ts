import { ActionOption } from 'touchdeck-model';
import { ActionRegistry, getAvailableActions } from '../actions/ActionRegistry';

export default function getActionOptions(
  registry: ActionRegistry
): () => ActionOption[] {
  return () =>
    getAvailableActions().map((action) => {
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

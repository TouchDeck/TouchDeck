import ActionConfig from '../model/configuration/ActionConfig';
import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { ActionParameter } from '../model/ActionOption';
import { actionParamsKey, PreparedAction } from './Action';
import { ButtonConfig } from '../model/configuration/ButtonConfig';

export type PreparedActions = { [id: string]: PreparedAction };

function prepareAction(action: ActionConfig): PreparedAction {
  // Get an instance of the action.
  const ActionCtor = getActionRegistry()[action.type].constructor;
  const actionInst = inject(ActionCtor);

  // Match the given arguments to the parameters.
  const params: ActionParameter[] =
    Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [];
  const args = params.map((param) => param && action.args[param.name]);

  return actionInst.prepare(...args);
}

export function prepareActions(buttons: ButtonConfig[]): PreparedActions {
  const actions: PreparedActions = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal' || button.type === 'toggle') {
      actions[button.id] = prepareAction(button.action);
    }
  }

  return actions;
}

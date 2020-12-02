import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { ActionParameter } from '../model/ActionOption';
import { actionParamsKey, PreparedAction } from './Action';
import {
  ButtonConfig,
  NormalButtonConfig,
  ToggleButtonConfig,
} from '../model/configuration/ButtonConfig';
import { getServerInstance } from '../serverInstance';

export type PreparedActions = { [id: string]: PreparedAction };

function prepareAction(
  button: NormalButtonConfig | ToggleButtonConfig
): PreparedAction {
  // Get an instance of the action.
  const ActionCtor = getActionRegistry()[button.action.type].constructor;
  const actionInst = inject(ActionCtor);

  // Match the given arguments to the parameters.
  const params: ActionParameter[] =
    Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [];
  const prepareArgs: unknown[] = params.map(
    (param) => param && button.action.args[param.name]
  );

  // If the button is a toggle button, pass a state change handler which when
  // called updates the button state and broadcasts it.
  if (button.type === 'toggle') {
    prepareArgs[0] = (state: boolean) => {
      getServerInstance().broadcast('button-state-changed', {
        buttonId: button.id,
        buttonState: state,
      });
    };
  }

  return actionInst.prepare(...prepareArgs);
}

export function prepareActions(buttons: ButtonConfig[]): PreparedActions {
  const actions: PreparedActions = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal' || button.type === 'toggle') {
      actions[button.id] = prepareAction(button);
    }
  }

  return actions;
}

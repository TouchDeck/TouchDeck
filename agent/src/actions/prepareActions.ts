import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { ActionParameter } from '../model/ActionOption';
import { actionParamsKey, PreparedAction } from './Action';
import {
  ButtonConfig,
  NormalButtonConfig,
  ToggleButtonConfig,
} from '../model/configuration/ButtonConfig';
import { getClientInstance } from '../serverInstance';
import { isPreparedToggleAction } from './ToggleAction';

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

  const prepared = actionInst.prepare(...prepareArgs);

  // If the button is a toggle button, register a state change handler which
  // updates the button state and broadcasts it.
  if (isPreparedToggleAction(prepared)) {
    prepared.registerChangeListener(
      async (state?: boolean): Promise<void> => {
        let buttonState = state;

        // If no new state is given, get it from the action.
        if (buttonState === undefined) {
          buttonState = await prepared.getState();
        }

        // Broadcast the new button state.
        getClientInstance().send('button-state-changed', {
          buttonId: button.id,
          buttonState,
        });
      }
    );
  }

  return prepared;
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

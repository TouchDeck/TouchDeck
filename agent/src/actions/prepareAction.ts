import ActionConfig from '../model/configuration/ActionConfig';
import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { ActionParameter } from '../model/ActionOption';
import { actionParamsKey, PreparedAction } from './Action';

export default function prepareAction(action: ActionConfig): PreparedAction {
  // Get an instance of the action.
  const ActionCtor = getActionRegistry()[action.type].constructor;
  const actionInst = inject(ActionCtor);

  // Match the given arguments to the parameters.
  const params: ActionParameter[] =
    Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [];
  const args = params.map((param) => param && action.args[param.name]);

  return actionInst.prepare(...args);
}

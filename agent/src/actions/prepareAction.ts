import ActionConfig from '../model/configuration/ActionConfig';
import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { ActionParameter } from '../model/ActionOption';
import { actionParamsKey } from './Action';

export type InvokableAction = () => void | Promise<void>;

export default function prepareAction(action: ActionConfig): InvokableAction {
  // If the action type is nullish, return a no-op.
  if (!action.type) {
    return () => undefined;
  }

  // Get an instance of the action.
  const ActionCtor = getActionRegistry()[action.type].constructor;
  const actionInst = inject(ActionCtor);

  // Match the given arguments to the parameters.
  const params: ActionParameter[] =
    Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [];
  const args = params.map((param) => param && action.args[param.name]);

  return () => actionInst.invoke(...args);
}

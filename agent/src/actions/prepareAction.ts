import ActionConfig from '../model/configuration/ActionConfig';
import { getActionRegistry } from './actionRegistry';
import inject from '../inject';
import { paramNamesKey } from './param';

export type InvokableAction = () => void | Promise<void>;

export default function prepareAction(action: ActionConfig): InvokableAction {
  // Get an instance of the action.
  const ActionCtor = getActionRegistry()[action.type].constructor;
  const actionInst = inject(ActionCtor);

  // Match the given arguments to the parameters.
  const paramNames: string[] =
    Reflect.getMetadata(
      paramNamesKey,
      ActionCtor.prototype,
      actionInst.invoke.name
    ) || [];
  const args = paramNames.map((name) => name && action.args[name]);

  return () => actionInst.invoke(...args);
}

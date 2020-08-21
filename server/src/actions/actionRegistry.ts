import { Constructor } from '../Constructor';
import DebugAction from './DebugAction';
import ObsSetSceneAction from './obs/ObsSetSceneAction';
import Action, { actionCategoryKey, actionNameKey } from './Action';
import 'reflect-metadata';

// A list containing all available action classes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actionClasses: Constructor<Action<any>>[] = [ObsSetSceneAction];

// Only add the debug action for development purposes.
if (process.env.NODE_ENV !== 'production') {
  actionClasses.push(DebugAction);
}

export interface ActionMeta {
  category: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor: Constructor<Action<any>>;
}

const actionMeta: ActionMeta[] = actionClasses.map((action) => ({
  constructor: action,
  category: Reflect.getMetadata(actionCategoryKey, action.prototype),
  name: Reflect.getMetadata(actionNameKey, action.prototype),
}));

export function getAvailableActions(): ActionMeta[] {
  return actionMeta;
}

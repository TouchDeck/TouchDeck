import { Constructor } from '../Constructor';
import DebugAction from './DebugAction';
import ObsSetSceneAction from './obs/ObsSetSceneAction';
import Action, { actionCategoryKey, actionNameKey } from './Action';
import 'reflect-metadata';
import ObsSetMuteAction from './obs/ObsSetMuteAction';

// A list containing all available action classes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actionClasses: Constructor<Action<any>>[] = [
  ObsSetMuteAction,
  ObsSetSceneAction,
];

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

// All action metadata by constructor name.
const actionRegistry: { [ctorName: string]: ActionMeta } = {};

// Put all action classes in the registry.
actionClasses.forEach((action) => {
  actionRegistry[action.name] = {
    category: Reflect.getMetadata(actionCategoryKey, action.prototype),
    name: Reflect.getMetadata(actionNameKey, action.prototype),
    constructor: action,
  };
});

export function getActionRegistry(): { [ctorName: string]: ActionMeta } {
  return actionRegistry;
}

export function getAvailableActions(): ActionMeta[] {
  return Object.values(actionRegistry);
}

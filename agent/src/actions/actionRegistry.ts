import { Constructor } from '../util/Constructor';
import ObsSetSceneAction from './obs/ObsSetSceneAction';
import {
  Action,
  actionCategoryKey,
  actionNameKey,
  actionParamsKey,
} from './Action';
import 'reflect-metadata';
import ObsSetMuteAction from './obs/ObsSetMuteAction';
import { ActionParameter } from '../model/ActionOption';
import NoopAction from './NoopAction';
import ObsSetVolumeAction from './obs/ObsSetVolumeAction';
import ObsSetSceneItemRenderAction from './obs/ObsSetSceneItemRenderAction';
import ObsToggleMuteAction from './obs/ObsToggleMuteAction';
import { actionToggleableKey } from './ToggleAction';
import ObsToggleSceneItemRenderAction from './obs/ObsToggleSceneItemRenderAction';

// A list containing all available action classes.
const actionClasses: Constructor<Action>[] = [
  NoopAction,
  // OBS
  ObsSetMuteAction,
  ObsSetSceneAction,
  ObsSetSceneItemRenderAction,
  ObsSetVolumeAction,
  ObsToggleMuteAction,
  ObsToggleSceneItemRenderAction,
];

export interface ActionMeta {
  category: string;
  name: string;
  constructor: Constructor<Action>;
  parameters: ActionParameter[];
  toggleable: boolean;
}

// All action metadata by constructor name.
const actionRegistry: { [ctorName: string]: ActionMeta } = {};

// Put all action classes in the registry.
actionClasses.forEach((ActionCtor) => {
  actionRegistry[ActionCtor.name] = {
    category: Reflect.getMetadata(actionCategoryKey, ActionCtor.prototype),
    name: Reflect.getMetadata(actionNameKey, ActionCtor.prototype),
    constructor: ActionCtor,
    parameters:
      Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [],
    toggleable:
      Reflect.getMetadata(actionToggleableKey, ActionCtor.prototype) || false,
  };
});

export function getActionRegistry(): { [ctorName: string]: ActionMeta } {
  return actionRegistry;
}

export function getAvailableActions(): ActionMeta[] {
  return Object.values(actionRegistry);
}

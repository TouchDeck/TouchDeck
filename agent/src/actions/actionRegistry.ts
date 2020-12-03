import { Constructor } from '../util/Constructor';
import ObsSetSceneAction from './obs/ObsSetSceneAction';
import {
  Action,
  actionCategoryKey,
  actionNameKey,
  actionParamsKey,
} from './Action';
import 'reflect-metadata';
import { ActionParameter, ToggleActionInfo } from '../model/ActionOption';
import NoopAction from './NoopAction';
import ObsSetVolumeAction from './obs/ObsSetVolumeAction';
import ObsToggleMuteAction from './obs/ObsToggleMuteAction';
import { actionToggleableKey, actionToggleInfoKey } from './ToggleAction';
import ObsToggleSceneItemRenderAction from './obs/ObsToggleSceneItemRenderAction';

// A list containing all available action classes.
const actionClasses: Constructor<Action>[] = [
  NoopAction,
  // OBS
  ObsSetSceneAction,
  ObsSetVolumeAction,
  ObsToggleMuteAction,
  ObsToggleSceneItemRenderAction,
];

export type ActionMeta = NormalActionMeta | ToggleActionMeta;

export interface BaseActionMeta {
  category: string;
  name: string;
  constructor: Constructor<Action>;
  parameters: ActionParameter[];
  toggleable: boolean;
}

export interface NormalActionMeta extends BaseActionMeta {
  toggleable: false;
}

export interface ToggleActionMeta extends BaseActionMeta {
  toggleable: true;
  toggleInfo: ToggleActionInfo;
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
    toggleInfo: Reflect.getMetadata(actionToggleInfoKey, ActionCtor.prototype),
  };
});

export function getActionRegistry(): { [ctorName: string]: ActionMeta } {
  return actionRegistry;
}

export function getAvailableActions(): ActionMeta[] {
  return Object.values(actionRegistry);
}

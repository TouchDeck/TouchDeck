import 'reflect-metadata';
import { ActionParameter, ToggleActionInfo } from 'touchdeck-model';
import { Logger } from '@luca_scorpion/tinylogger';
import { Constructor } from '../util/Constructor';
import ObsSetSceneAction from './obs/ObsSetSceneAction';
import {
  Action,
  actionCategoryKey,
  actionNameKey,
  actionParamsKey,
} from './Action';
import NoopAction from './NoopAction';
import ObsSetVolumeAction from './obs/ObsSetVolumeAction';
import ObsToggleMuteAction from './obs/ObsToggleMuteAction';
import { actionToggleableKey, actionToggleInfoKey } from './ToggleAction';
import ObsToggleSceneItemRenderAction from './obs/ObsToggleSceneItemRenderAction';
import { singleton } from '../Injector';

// A list containing all available action classes.
const actionClasses: Constructor<Action>[] = [
  NoopAction,
  // OBS
  ObsSetSceneAction,
  ObsSetVolumeAction,
  ObsToggleMuteAction,
  ObsToggleSceneItemRenderAction,
];

@singleton
export class ActionRegistry {
  private static readonly log = new Logger(ActionRegistry.name);

  // All action metadata by constructor name.
  private readonly actionRegistry: { [ctorName: string]: ActionMeta } = {};

  public constructor() {
    // Put all action classes in the registry.
    actionClasses.forEach((ActionCtor) => {
      this.actionRegistry[ActionCtor.name] = {
        constructor: ActionCtor,
        category: Reflect.getMetadata(actionCategoryKey, ActionCtor.prototype),
        name: Reflect.getMetadata(actionNameKey, ActionCtor.prototype),
        parameters:
          Reflect.getMetadata(actionParamsKey, ActionCtor.prototype) || [],
        toggleable:
          Reflect.getMetadata(actionToggleableKey, ActionCtor.prototype) ||
          false,
        toggleInfo: Reflect.getMetadata(
          actionToggleInfoKey,
          ActionCtor.prototype
        ),
      };
    });

    // Log some debug information.
    const actions = this.getAvailableActions();
    ActionRegistry.log.debug(`Found ${actions.length} action classes:`);
    actions.forEach((action) =>
      ActionRegistry.log.debug(
        `  - ${action.category}/${action.name} (${action.constructor.name})`
      )
    );
  }

  public getAvailableActions(): ActionMeta[] {
    return Object.values(this.actionRegistry);
  }
}

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

export function getActionRegistry(): { [ctorName: string]: ActionMeta } {
  return {}; // TODO actionRegistry;
}

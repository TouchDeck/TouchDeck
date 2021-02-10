import 'reflect-metadata';
import {
  ActionParameter,
  ButtonConfig,
  NormalButtonConfig,
  ToggleActionInfo,
  ToggleButtonConfig,
} from 'touchdeck-model';
import { Logger } from '@luca_scorpion/tinylogger';
import { Constructor } from '../util/Constructor';
import { ObsSetSceneAction } from './obs/ObsSetSceneAction';
import {
  Action,
  actionCategoryKey,
  actionNameKey,
  actionParamsKey,
  PreparedAction,
} from './Action';
import { NoopAction } from './NoopAction';
import { ObsSetVolumeAction } from './obs/ObsSetVolumeAction';
import { ObsToggleMuteAction } from './obs/ObsToggleMuteAction';
import {
  actionToggleableKey,
  actionToggleInfoKey,
  isPreparedToggleAction,
} from './ToggleAction';
import { ObsToggleSceneItemRenderAction } from './obs/ObsToggleSceneItemRenderAction';
import { Injector, singleton } from '../Injector';
import WebSocketClient from '../WebSocketClient';
import { TemplateSetValueAction } from './template/TemplateSetValueAction';
import { TemplateChangeValueAction } from './template/TemplateChangeValueAction';

// A list containing all available action classes.
const actionClasses: Constructor<Action>[] = [
  NoopAction,
  // OBS
  ObsSetSceneAction,
  ObsSetVolumeAction,
  ObsToggleMuteAction,
  ObsToggleSceneItemRenderAction,
  // Template
  TemplateChangeValueAction,
  TemplateSetValueAction,
];

@singleton
export class ActionRegistry {
  private static readonly log = new Logger(ActionRegistry.name);

  // All action metadata by constructor name.
  private readonly actionRegistry: { [ctorName: string]: ActionMeta } = {};

  private prepared: PreparedActions = {};

  public constructor(
    private readonly injector: Injector,
    private readonly client: WebSocketClient
  ) {
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
    const actions = this.availableActions;
    ActionRegistry.log.debug(`Found ${actions.length} action classes:`);
    actions.forEach((action) =>
      ActionRegistry.log.debug(
        `  - ${action.category}/${action.name} (${action.constructor.name})`
      )
    );
  }

  public get preparedActions(): PreparedActions {
    return this.prepared;
  }

  public get availableActions(): ActionMeta[] {
    return Object.values(this.actionRegistry);
  }

  public prepareActions(buttons: ButtonConfig[]): void {
    // Clear the current prepared actions.
    for (const action of Object.values(this.prepared)) {
      if (isPreparedToggleAction(action)) {
        action.removeChangeListener();
      }
    }

    // Prepare all the new actions.
    this.prepared = {};
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.type === 'normal' || button.type === 'toggle') {
        this.prepared[button.id] = this.prepareAction(button);
      }
    }
  }

  private prepareAction(
    button: NormalButtonConfig | ToggleButtonConfig
  ): PreparedAction {
    // Get an instance of the action.
    // TODO: Cache action instances, no need to get a new instance every time.
    const ActionCtor = this.actionRegistry[button.action.type].constructor;
    const actionInst = this.injector.getInstance(ActionCtor);

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
          this.client.send('button-state-changed', {
            buttonId: button.id,
            buttonState,
          });
        }
      );
    }

    return prepared;
  }
}

type PreparedActions = { [id: string]: PreparedAction };

type ActionMeta = NormalActionMeta | ToggleActionMeta;

interface BaseActionMeta {
  category: string;
  name: string;
  constructor: Constructor<Action>;
  parameters: ActionParameter[];
  toggleable: boolean;
}

interface NormalActionMeta extends BaseActionMeta {
  toggleable: false;
}

interface ToggleActionMeta extends BaseActionMeta {
  toggleable: true;
  toggleInfo: ToggleActionInfo;
}

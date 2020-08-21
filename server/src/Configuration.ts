import Logger from './Logger';

const log = new Logger('Configuration');

// Cached configuration data.
let configuration: Configuration;
let actionsByUuid: ActionsByUuid;

export type ActionsByUuid = { [uuid: string]: ActionConfig };

function getActionsFromButtons(buttons: Button[]): ActionsByUuid {
  let actions: ActionsByUuid = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal') {
      actions[button.action.uuid] = button.action;
    }
    if (button.type === 'folder') {
      actions = { ...actions, ...getActionsFromButtons(button.buttons) };
    }
  }

  return actions;
}

export function loadConfiguration(): void {
  log.debug('Loading configuration');

  // TODO: Load config from fs.
  configuration = {
    buttons: [
      {
        type: 'normal',
        action: {
          uuid: '1',
          type: 'Debug',
          args: {
            value: 'arg',
          },
        },
      },
      {
        type: 'folder',
        buttons: [
          {
            type: 'normal',
            action: {
              uuid: '2',
              type: 'Debug',
              args: {
                value: 'in folder',
              },
            },
          },
        ],
      },
    ],
  };

  actionsByUuid = getActionsFromButtons(configuration.buttons);
}

export function getActionsByUuid(): ActionsByUuid {
  return actionsByUuid;
}

export interface Configuration {
  buttons: Button[];
}

export interface ActionConfig {
  uuid: string;
  type: string;
  args: Record<string, unknown>;
}

export type Button = NormalButton | ToggleButton | FolderButton;

export interface BaseButton {
  type: string;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  description?: string;
}

export interface NormalButton extends BaseButton {
  type: 'normal';
  image?: string;
  action: ActionConfig;
}

export interface ToggleButton extends BaseButton {
  type: 'toggle';
  state1: NormalButton;
  state2: NormalButton;
}

export interface FolderButton extends BaseButton {
  type: 'folder';
  buttons: Button[];
  image?: string;
}

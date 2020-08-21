import * as fs from 'fs/promises';
import Logger from './Logger';
import { CONFIG_DIR, CONFIG_FILE } from './config';

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

export async function loadConfiguration(): Promise<void> {
  log.debug('Loading configuration');

  // Check if the config directory and file exist.
  await fs.stat(CONFIG_DIR).catch(() => fs.mkdir(CONFIG_DIR));
  await fs.stat(CONFIG_FILE).catch(() => fs.writeFile(CONFIG_FILE, '{}'));

  // Read the config file.
  const configJson = (
    await fs.readFile(CONFIG_FILE, { encoding: 'utf-8' })
  ).toString();
  configuration = JSON.parse(configJson);

  actionsByUuid = getActionsFromButtons(configuration.buttons);
}

export async function saveConfiguration(): Promise<void> {
  log.debug('Saving configuration');

  await fs.writeFile(CONFIG_FILE, JSON.stringify(configuration, null, 2));
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

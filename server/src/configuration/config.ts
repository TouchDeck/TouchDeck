import * as fs from 'fs/promises';
import { Button } from './buttons';
import Logger from '../Logger';
import { CONFIG_DIR, CONFIG_FILE } from '../constants';
import prepareAction, { InvokableAction } from '../actions/prepareAction';

const log = new Logger('Configuration');

export type ActionsByUuid = { [uuid: string]: InvokableAction };

// Cached configuration data.
let configuration: Configuration;
let actionsByUuid: ActionsByUuid;

function getActionsFromButtons(buttons: Button[]): ActionsByUuid {
  let actions: ActionsByUuid = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal') {
      actions[button.action.uuid] = prepareAction(button.action);
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

export async function setConfiguration(
  newConfig: Configuration
): Promise<void> {
  log.debug('Updating configuration');

  configuration = newConfig;
  actionsByUuid = getActionsFromButtons(configuration.buttons);

  await saveConfiguration();
}

export function getConfiguration(): Configuration {
  return configuration;
}

export function getActionsByUuid(): ActionsByUuid {
  return actionsByUuid;
}

export interface Configuration {
  buttons: Button[];
}

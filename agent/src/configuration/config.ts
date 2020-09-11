import * as fs from 'fs/promises';
import Logger from '../Logger';
import { CONFIG_DIR, CONFIG_FILE } from '../constants';
import prepareAction, { InvokableAction } from '../actions/prepareAction';
import Configuration from '../model/configuration/Configuration';
import { ButtonConfig } from '../model/configuration/ButtonConfig';

const log = new Logger('Configuration');

export type ActionsById = { [id: string]: InvokableAction };

// Cached configuration data.
let configuration: Configuration;
let actionsById: ActionsById;

function getActionsFromButtons(buttons: ButtonConfig[]): ActionsById {
  let actions: ActionsById = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal') {
      actions[button.action.id] = prepareAction(button.action);
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

  actionsById = getActionsFromButtons(configuration.buttons);
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
  actionsById = getActionsFromButtons(configuration.buttons);

  await saveConfiguration();
}

export function getConfiguration(): Configuration {
  return configuration;
}

export function getActionsById(): ActionsById {
  return actionsById;
}

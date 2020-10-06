import { promises as fs } from 'fs';
import { Logger } from '@luca_scorpion/tinylogger';
import { CONFIG_DIR, CONFIG_FILE, IMAGES_DIR } from '../constants';
import prepareAction from '../actions/prepareAction';
import Configuration from '../model/configuration/Configuration';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import validateConfig from './validateConfig';
import { PreparedAction } from '../actions/Action';

const log = new Logger('configuration');

export type PreparedActionsById = { [id: string]: PreparedAction };

// Cached configuration data.
let configuration: Configuration;
let preparedActions: PreparedActionsById;

function prepareActions(buttons: ButtonConfig[]): void {
  const actions: PreparedActionsById = {};

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.type === 'normal' || button.type === 'toggle') {
      actions[button.action.id] = prepareAction(button.action);
    }
  }

  preparedActions = actions;
}

export async function readConfiguration(): Promise<Configuration> {
  log.debug('Reading configuration from disk');

  // Check if the config directory and file exist.
  await fs.stat(CONFIG_DIR).catch(() => fs.mkdir(CONFIG_DIR));
  await fs.stat(CONFIG_FILE).catch(() => fs.writeFile(CONFIG_FILE, '{}'));
  await fs.stat(IMAGES_DIR).catch(() => fs.mkdir(IMAGES_DIR));

  // Read the config file.
  const configJson = (
    await fs.readFile(CONFIG_FILE, { encoding: 'utf-8' })
  ).toString();
  return JSON.parse(configJson);
}

export async function saveConfiguration(): Promise<void> {
  log.debug('Writing configuration to disk');
  await fs.writeFile(CONFIG_FILE, JSON.stringify(configuration, null, 2));
}

export async function setConfiguration(
  newConfig: Configuration
): Promise<void> {
  log.debug('Updating configuration');

  configuration = validateConfig(newConfig);
  prepareActions(configuration.buttons);

  await saveConfiguration();
}

export function getConfiguration(): Configuration {
  return configuration;
}

export function getPreparedActions(): PreparedActionsById {
  return preparedActions;
}

import { homedir } from 'os';
import { resolve } from 'path';

function envOrDefault(param: string, def: string): string {
  const env = process.env[param];
  return env === undefined ? def : env;
}

export const CONFIG_DIR = resolve(
  envOrDefault('CONFIG_DIR', resolve(homedir(), '.touchdeck'))
);
export const CONFIG_FILE = resolve(CONFIG_DIR, 'config.json');
export const IMAGES_DIR = resolve(CONFIG_DIR, 'images');
export const TEMPLATES_DIR = resolve(CONFIG_DIR, 'templates');
export const TEMPLATES_OUTPUT_DIR = resolve(CONFIG_DIR, 'templates_output');
export const SCRIPTS_DIR = resolve(CONFIG_DIR, 'scripts');

export const WS_PROXY_SERVER = envOrDefault(
  'WS_PROXY_SERVER',
  'wss://wsproxy.touchdeck.app'
);

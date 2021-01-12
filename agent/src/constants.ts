import { homedir } from 'os';

function envOrDefault(param: string, def: string): string {
  const env = process.env[param];
  return env === undefined ? def : env;
}

export const CONFIG_DIR = envOrDefault('CONFIG_DIR', `${homedir()}/.touchdeck`);
export const CONFIG_FILE = `${CONFIG_DIR}/config.json`;
export const IMAGES_DIR = `${CONFIG_DIR}/images`;

export const WS_PROXY_SERVER = envOrDefault(
  'WS_PROXY_SERVER',
  'wss://wsproxy.touchdeck.app'
);

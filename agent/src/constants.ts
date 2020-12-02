import { homedir } from 'os';

function envOrDefault(param: string, def: string): string {
  const env = process.env[param];
  return env === undefined ? def : env;
}

export const HTTP_PORT = parseInt(envOrDefault('HTTP_PORT', '4000'), 10);
export const PORT = parseInt(envOrDefault('PORT', '0'), 10);

export const CONFIG_DIR = envOrDefault('CONFIG_DIR', `${homedir()}/.touchdeck`);
export const CONFIG_FILE = `${CONFIG_DIR}/config.json`;
export const IMAGES_DIR = `${CONFIG_DIR}/images`;

export const DISCOVERY_SERVER = envOrDefault(
  'DISCOVERY_SERVER',
  'https://discovery.scorpiac.com'
);

export const DISCOVERY_REPORT_TIME = parseInt(
  envOrDefault('DISCOVERY_REPORT_TIME', '600'),
  10
);

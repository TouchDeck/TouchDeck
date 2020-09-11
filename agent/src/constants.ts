import { homedir } from 'os';

function envOrDefault(param: string, def: string): string {
  const env = process.env[param];
  return env === undefined ? def : env;
}

export const CONFIG_DIR = envOrDefault('CONFIG_DIR', `${homedir()}/.pideck`);
export const CONFIG_FILE = `${CONFIG_DIR}/config.json`;

export const PORT = parseInt(envOrDefault('PORT', '4000'), 10);

export const DISCOVERY_SERVER = envOrDefault(
  'DISCOVERY_SERVER',
  'http://localhost:5000'
);

import os from 'os';
import { AgentMeta } from 'touchdeck-model';
import getPlatform from './getPlatform';
import getLocalAddress from './getLocalAddress';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

/**
 * Get agent metadata from the package.json and some computer info.
 */
export function getAgentMeta(): AgentMeta {
  return {
    name: packageJson.name,
    version: packageJson.version,
    address: getLocalAddress(),
    platform: getPlatform(),
    hostname: os.hostname(),
  };
}

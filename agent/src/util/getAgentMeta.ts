import os from 'os';
import getPlatform from './getPlatform';
import getLocalAddress from './getLocalAddress';
import { AgentMeta } from '../model/AgentInfo';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

/**
 * Get agent metadata from the package.json and some computer info.
 */
export default function getAgentMeta(): AgentMeta {
  return {
    name: packageJson.name,
    version: packageJson.version,
    address: getLocalAddress(),
    platform: getPlatform(),
    hostname: os.hostname(),
  };
}

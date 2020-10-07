import os from 'os';
import getPlatform from './getPlatform';
import getLocalAddress from './getLocalAddress';
import AgentInfo from '../model/AgentInfo';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

export default function getAgentInfo(port: number): AgentInfo {
  return {
    name: packageJson.name,
    version: packageJson.version,
    address: `ws://${getLocalAddress()}:${port}`,
    platform: getPlatform(),
    hostname: os.hostname(),
  };
}

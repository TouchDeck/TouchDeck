import { Request, Response } from 'express';
import os from 'os';
import AgentInfo from '../model/AgentInfo';
import getPlatform from '../util/getPlatform';
import getLocalAddress from '../util/getLocalAddress';
import { HTTP_PORT } from '../constants';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

export const agentInfo: AgentInfo = {
  name: packageJson.name,
  version: packageJson.version,
  address: `${getLocalAddress()}:${HTTP_PORT}`,
  platform: getPlatform(),
  hostname: os.hostname(),
};

export default function getAgentInfo(
  req: Request,
  res: Response<AgentInfo>
): void {
  res.json(agentInfo);
}

import { Request, Response } from 'express';
import AgentInfo from '../model/AgentInfo';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

const agentInfo = {
  name: packageJson.name,
  version: packageJson.version,
};

export default function getServerInfo(
  req: Request,
  res: Response<AgentInfo>
): void {
  res.json(agentInfo);
}

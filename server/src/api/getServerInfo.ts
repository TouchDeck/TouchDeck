import { Request, Response } from 'express';

// We need to use require instead of import because package.json is not under the rootDir (src).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

const serverInfo = {
  name: packageJson.name,
  version: packageJson.version,
};

export default function getServerInfo(req: Request, res: Response): void {
  res.json(serverInfo);
}

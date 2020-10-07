import fetch from 'node-fetch';
import { Logger } from '@luca_scorpion/tinylogger';
import { DISCOVERY_SERVER } from '../constants';
import getAgentInfo from './getAgentInfo';

const log = new Logger('reportAgentDiscovery');

export default async function reportAgentDiscovery(
  port: number
): Promise<void> {
  await fetch(`${DISCOVERY_SERVER}/api/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getAgentInfo(port)),
  })
    .then(() => log.debug('Agent reported to discovery server'))
    .catch((err) =>
      log.error(`Failed to report agent to discovery server: ${err.message}`)
    );
}

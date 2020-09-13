import { Request, Response } from 'express';
import { KEEP_AGENT_TIME } from './constants';

interface AgentInfo {
  name: string;
  version: string;
  address: string;
  platform: string;
  hostname: string;
}

interface AgentWithTimeout extends AgentInfo {
  removalTimeout: NodeJS.Timeout;
}

const agents: { [publicIp: string]: AgentWithTimeout[] } = {};

function removeAgent(
  reqIp: string,
  address: string
): AgentWithTimeout | undefined {
  const agentList = agents[reqIp] || [];

  for (let i = 0; i < agentList.length; i++) {
    if (agentList[i].address === address) {
      const removed = agentList.splice(i, 1)[0];
      agents[reqIp] = agentList;
      return removed;
    }
  }

  return undefined;
}

function getRequestIp(req: Request): string {
  // Make sure the IP address is always the same when coming from localhost.
  return req.ip === '::1' ? '::ffff:127.0.0.1' : req.ip;
}

export function getAgents(req: Request, res: Response<AgentInfo[]>): void {
  res.json(
    (agents[getRequestIp(req)] || []).map(
      ({ name, version, address, platform, hostname }) => ({
        name,
        version,
        address,
        platform,
        hostname,
      })
    )
  );
}

export function registerAgent(req: Request, res: Response<AgentInfo[]>): void {
  const info: AgentWithTimeout = req.body;
  const requestIp = getRequestIp(req);

  // Remove any agents with the same address and clear their removal timeout.
  const oldAgent = removeAgent(requestIp, info.address);
  if (oldAgent) {
    clearTimeout(oldAgent.removalTimeout);
  }

  // Set a timeout for removing the new agent.
  info.removalTimeout = setTimeout(
    () => removeAgent(requestIp, info.address),
    KEEP_AGENT_TIME * 1000
  );

  // Add the new agent to the list, store it.
  const newAgents = agents[requestIp] || [];
  newAgents.push(info);
  agents[requestIp] = newAgents;

  getAgents(req, res);
}

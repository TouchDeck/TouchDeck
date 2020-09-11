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

export function getAgents(req: Request, res: Response<AgentInfo[]>): void {
  res.json(
    (agents[req.ip] || []).map(
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

  // Remove any agents with the same address and clear their removal timeout.
  const oldAgent = removeAgent(req.ip, info.address);
  if (oldAgent) {
    clearTimeout(oldAgent.removalTimeout);
  }

  // Set a timeout for removing the new agent.
  info.removalTimeout = setTimeout(
    () => removeAgent(req.ip, info.address),
    KEEP_AGENT_TIME * 1000
  );

  // Add the new agent to the list, store it.
  const newAgents = agents[req.ip] || [];
  newAgents.push(info);
  agents[req.ip] = newAgents;

  getAgents(req, res);
}

import { Request, Response } from 'express';
import { KEEP_AGENT_TIME } from './constants';

export type Platform = 'windows' | 'linux' | 'apple' | 'other';

export interface AgentInfo {
  address: string;
  platform: Platform;
  removalTimeout: NodeJS.Timeout;
}

const agents: { [publicIp: string]: AgentInfo[] } = {};

function removeAgent(reqIp: string, address: string): void {
  agents[reqIp] = (agents[reqIp] || []).filter((a) => a.address !== address);
}

export function getAgents(req: Request, res: Response): void {
  const response = (agents[req.ip] || []).map((agent) => ({
    address: agent.address,
    platform: agent.platform,
  }));
  res.json(response);
}

export function registerAgent(req: Request, res: Response): void {
  const info: AgentInfo = req.body;
  const currentAgents = agents[req.ip] || [];

  // If there is an agent with the same address, clear the removal timeout and remove it.
  const sameAddressAgent = currentAgents.find(
    (a) => a.address === info.address
  );
  if (sameAddressAgent) {
    clearTimeout(sameAddressAgent.removalTimeout);
  }
  const newAgents = currentAgents.filter((a) => a.address !== info.address);

  // Set a timeout for removing the new agent.
  info.removalTimeout = setTimeout(
    () => removeAgent(req.ip, info.address),
    KEEP_AGENT_TIME * 1000
  );

  // Add the new agent to the list, store it.
  newAgents.push(info);
  agents[req.ip] = newAgents;

  getAgents(req, res);
}

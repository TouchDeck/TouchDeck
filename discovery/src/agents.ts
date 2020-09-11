import { Request, Response } from 'express';

export type Platform = 'windows' | 'linux' | 'apple' | 'other';

export interface AgentInfo {
  address: string;
  platform: Platform;
}

const agents: { [publicIp: string]: AgentInfo[] } = {};

export function getAgents(req: Request, res: Response): void {
  res.json(agents[req.ip] || []);
}

export function registerAgent(req: Request, res: Response): void {
  const info: AgentInfo = req.body;

  // Get the current agents, removing any that have the same address as the new one.
  const existingAgents = (agents[req.ip] || []).filter(
    (a) => a.address !== info.address
  );

  // Add the new agent to the list, store it.
  existingAgents.push(info);
  agents[req.ip] = existingAgents;

  getAgents(req, res);
}

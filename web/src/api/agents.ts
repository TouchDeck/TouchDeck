export interface AgentInfo {
  address: string;
  platform: string;
}

export async function listAgents(): Promise<AgentInfo[]> {
  return (await fetch('http://localhost:5000/api/agents')).json();
}

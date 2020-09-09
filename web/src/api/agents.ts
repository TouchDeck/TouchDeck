export interface AgentInfo {
  localAddress: string;
  os: string;
}

export async function listAgents(): Promise<AgentInfo[]> {
  // TODO
  return Promise.resolve([
    {
      localAddress: 'http://localhost:3000',
      os: 'windows',
    },
    {
      localAddress: '192.168.0.40:3000',
      os: 'linux',
    },
    {
      localAddress: '10.0.0.17:3000',
      os: 'apple',
    },
  ]);
}

import AgentInfo from '../model/AgentInfo';

export default async function listDiscoveredAgents(): Promise<AgentInfo[]> {
  return (await fetch('https://discovery.scorpiac.com/api/agents')).json();
}

import AgentInfo from '../model/AgentInfo';

export default async function listDiscoveredAgents(): Promise<AgentInfo[]> {
  return (await fetch('http://localhost:5000/api/agents')).json();
}

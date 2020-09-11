import DiscoveredAgent from '../model/DiscoveredAgent';

export default async function listDiscoveredAgents(): Promise<
  DiscoveredAgent[]
> {
  return (await fetch('http://localhost:5000/api/agents')).json();
}

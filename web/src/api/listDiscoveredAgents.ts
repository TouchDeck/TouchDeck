import { AgentInfo } from '../model/AgentInfo';

export default async function listDiscoveredAgents(): Promise<AgentInfo[]> {
  return (await fetch('https://wsproxy.touchdeck.app/agents')).json();
}

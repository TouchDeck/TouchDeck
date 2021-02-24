import { AgentInfo } from 'touchdeck-model';

export async function listDiscoveredAgents(): Promise<AgentInfo[]> {
  return (await fetch('https://wsproxy.touchdeck.app/agents')).json();
}

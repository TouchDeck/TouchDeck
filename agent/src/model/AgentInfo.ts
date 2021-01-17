export type Platform = 'windows' | 'linux' | 'apple' | '';

export interface AgentInfo {
  id: string;
  meta: AgentMeta;
}

export interface AgentMeta {
  name: string;
  version: string;
  address: string;
  platform: Platform;
  hostname: string;
}

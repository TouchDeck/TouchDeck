export type Platform = 'windows' | 'linux' | 'apple' | '';

export default interface AgentInfo {
  name: string;
  version: string;
  address: string;
  platform: Platform;
  hostname: string;
}

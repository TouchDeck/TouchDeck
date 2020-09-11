export type Platform = 'windows' | 'linux' | 'apple' | 'other';

export default interface DiscoveredAgent {
  address: string;
  platform: Platform;
}

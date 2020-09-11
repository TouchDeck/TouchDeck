import os from 'os';

export type Platform = 'windows' | 'linux' | 'apple' | 'other';

const platformMapping: { [key: string]: Platform } = {
  win32: 'windows',
  darwin: 'apple',
  linux: 'linux',
};

export default function getPlatform(): Platform {
  return platformMapping[os.platform()] || 'other';
}

import os from 'os';
import { Platform } from '../model/DiscoveredAgent';

const platformMapping: { [key: string]: Platform } = {
  win32: 'windows',
  darwin: 'apple',
  linux: 'linux',
};

export default function getPlatform(): Platform {
  return platformMapping[os.platform()] || 'other';
}

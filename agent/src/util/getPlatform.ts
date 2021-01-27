import os from 'os';
import { Platform } from 'touchdeck-model';

const platformMapping: { [key: string]: Platform } = {
  win32: 'windows',
  darwin: 'apple',
  linux: 'linux',
};

export default function getPlatform(): Platform {
  return platformMapping[os.platform()] || '';
}

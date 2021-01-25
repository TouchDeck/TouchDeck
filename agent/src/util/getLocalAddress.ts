import os from 'os';

/**
 * Get the local IPv4 network address.
 */
export default function getLocalAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const interfaceInfo of Object.values(interfaces)) {
    if (interfaceInfo) {
      for (const net of interfaceInfo) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return '';
}

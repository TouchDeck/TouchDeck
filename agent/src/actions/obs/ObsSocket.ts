import OBSWebSocket from 'obs-websocket-js';
import { Logger } from '@luca_scorpion/tinylogger';
import { singleton } from '../../inject';

enum ConnectionStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

@singleton
export default class ObsSocket {
  private static readonly log = new Logger(ObsSocket.name);

  private readonly obs: OBSWebSocket;

  private status = ConnectionStatus.DISCONNECTED;

  public constructor() {
    this.obs = new OBSWebSocket();

    this.obs.on('ConnectionOpened', async () => {
      const version = await this.obs.send('GetVersion');
      ObsSocket.log.debug(
        `Connected to OBS version ${version['obs-studio-version']}, websocket plugin version ${version['obs-websocket-version']}`
      );
    });

    // Hook into the socket disconnect event.
    this.obs.on('ConnectionClosed', () => {
      ObsSocket.log.debug('Connection closed');
      this.status = ConnectionStatus.DISCONNECTED;
    });
  }

  public async getSocket(): Promise<OBSWebSocket> {
    await this.assertConnected();
    return this.obs;
  }

  private async tryConnect(): Promise<void> {
    this.status = ConnectionStatus.CONNECTING;
    try {
      await this.obs.connect();
      this.status = ConnectionStatus.CONNECTED;
    } catch (e) {
      ObsSocket.log.debug(`Could not connect to OBS: ${e.description}`);
    }
  }

  private async assertConnected(): Promise<void> {
    // If we are not connected, try to connect.
    if (this.status === ConnectionStatus.DISCONNECTED) {
      await this.tryConnect().then(() => {
        // Simply putting this block after the `await` seems to confuse typescript.
        // Putting it in the `then` seems to work fine though.

        // If we are still not connected, throw an error.
        if (this.status !== ConnectionStatus.CONNECTED) {
          throw new Error('Not connected to OBS');
        }
      });
    }
  }
}

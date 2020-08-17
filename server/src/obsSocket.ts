import OBSWebSocket from 'obs-websocket-js';

export interface VersionResult {
  'obs-websocket-version': string;
  'obs-studio-version': string;
}

export default class ObsSocket {
  private readonly obs: OBSWebSocket;

  public constructor() {
    this.obs = new OBSWebSocket();
  }

  public async connect(): Promise<void> {
    await this.obs.connect();
    const version = await this.getVersion();
    console.log(`Connected to OBS version ${version['obs-studio-version']}, websocket plugin version ${version['obs-websocket-version']}`);
  }

  public async getVersion(): Promise<VersionResult> {
    return this.obs.send('GetVersion');
  }

  public async setScene(scene: string): Promise<void> {
    return this.obs.send('SetCurrentScene', { 'scene-name': scene });
  }

  public async getSceneNames(): Promise<string[]> {
    const response = await this.obs.send('GetSceneList');
    return response.scenes.map(scene => scene.name);
  }
}


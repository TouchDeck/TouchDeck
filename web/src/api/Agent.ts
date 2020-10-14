import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import AgentInfo from '../model/AgentInfo';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import WebSocketClient from '../WebSocketClient';
import ButtonStateChanged from '../model/messages/ButtonStateChanged';
import { ImageMap } from '../model/messages/ImageMap';
import { PressButtonResult } from '../model/messages/PressButtonResult';
import sanitizeWsAddress from '../util/sanitizeWsAddress';

export default class Agent {
  private readonly socket: WebSocketClient;

  public constructor(address: string) {
    this.socket = new WebSocketClient(`${sanitizeWsAddress(address)}/ws`);
  }

  public connect(): Promise<void> {
    return this.socket.connect();
  }

  public onDisconnect(handler: () => void): void {
    this.socket.onDisconnect(handler);
  }

  public onButtonStateChanged(
    handler: (data: ButtonStateChanged) => void
  ): void {
    this.socket.registerHandler('button-state-changed', handler);
  }

  public async getInfo(): Promise<AgentInfo> {
    return this.socket.send('get-info');
  }

  public async getConfiguration(): Promise<Configuration> {
    return this.socket.send('get-configuration');
  }

  public async setConfiguration(
    newConfig: Configuration
  ): Promise<Configuration> {
    return this.socket.send('set-configuration', newConfig);
  }

  public async upsertButton(newButton: ButtonConfig): Promise<Configuration> {
    return this.socket.send('upsert-configuration-button', newButton);
  }

  public async deleteButton(buttonId: string): Promise<Configuration> {
    return this.socket.send('delete-configuration-button', buttonId);
  }

  public async setLayout(newLayout: ButtonLayout): Promise<Configuration> {
    return this.socket.send('set-layout', newLayout);
  }

  public async pressButton(buttonId: string): Promise<PressButtonResult> {
    return this.socket.send('press-button', buttonId);
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return this.socket.send('get-action-options');
  }

  public async getImages(): Promise<ImageMap> {
    return this.socket.send('get-images');
  }
}

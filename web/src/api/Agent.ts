import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import AgentInfo from '../model/AgentInfo';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import { InvokeActionResponse } from '../model/InvokeActionResponse';
import WebSocketClient from '../WebSocketClient';

export default class Agent {
  private readonly socket: WebSocketClient;

  public constructor(private readonly address: string) {
    // TODO: use address from discovery server.
    this.socket = new WebSocketClient(address);
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

  public async setLayout(
    layoutId: string,
    newLayout: ButtonLayout
  ): Promise<Configuration> {
    return this.socket.send('set-layout', {
      layoutId,
      layout: newLayout,
    });
  }

  public async pressButton(buttonId: string): Promise<InvokeActionResponse> {
    return this.socket.send('press-button', buttonId);
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return this.socket.send('get-action-options');
  }
}

import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import AgentInfo from '../model/AgentInfo';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import { InvokeActionResponse } from '../model/InvokeActionResponse';
import { ButtonStates } from '../model/ButtonStates';
import WebSocketClient from '../WebSocketClient';

export default class Agent {
  private readonly socket: WebSocketClient;

  public constructor(private readonly address: string) {
    // TODO: use address from discovery server.
    this.socket = new WebSocketClient('ws://localhost:4001');
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
    return (
      await fetch(this.getUrl('/api/config'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })
    ).json();
  }

  public async setButton(
    buttonId: string,
    newButton: ButtonConfig
  ): Promise<Configuration> {
    return (
      await fetch(this.getUrl(`/api/config/buttons/${buttonId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newButton),
      })
    ).json();
  }

  public async deleteButton(buttonId: string): Promise<Configuration> {
    return (
      await fetch(this.getUrl(`/api/config/buttons/${buttonId}`), {
        method: 'DELETE',
      })
    ).json();
  }

  public async setLayout(
    layoutId: string,
    newLayout: ButtonLayout
  ): Promise<Configuration> {
    return (
      await fetch(this.getUrl(`/api/config/layouts/${layoutId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLayout),
      })
    ).json();
  }

  public async pressButton(id: string): Promise<InvokeActionResponse> {
    return (
      await fetch(this.getUrl(`/api/buttons/${id}`), { method: 'POST' })
    ).json();
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return this.socket.send('get-action-options');
  }

  public async getButtonStates(): Promise<ButtonStates> {
    return (await fetch(this.getUrl('/api/actions/states'))).json();
  }

  private getUrl(path: string): string {
    return `${this.address}${path}`;
  }
}

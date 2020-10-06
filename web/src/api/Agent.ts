import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import fetchTimeout from '../util/fetchTimeout';
import AgentInfo from '../model/AgentInfo';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import { InvokeActionResponse } from '../model/InvokeActionResponse';
import { ButtonStates } from '../model/ButtonStates';

export default class Agent {
  public constructor(private readonly address: string) {}

  public async getInfo(): Promise<AgentInfo> {
    return (await fetchTimeout(this.getUrl('/api'), 5000)).json();
  }

  public async getConfiguration(): Promise<Configuration> {
    return (await fetch(this.getUrl('/api/config'))).json();
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

  public async invokeAction(id: string): Promise<InvokeActionResponse> {
    return (
      await fetch(this.getUrl(`/api/actions/${id}`), { method: 'POST' })
    ).json();
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return (await fetch(this.getUrl('/api/actions/options'))).json();
  }

  public async getButtonStates(): Promise<ButtonStates> {
    return (await fetch(this.getUrl('/api/actions/states'))).json();
  }

  private getUrl(path: string): string {
    return `${this.address}${path}`;
  }
}

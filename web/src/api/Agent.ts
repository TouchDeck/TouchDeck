import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import fetchTimeout from '../util/fetchTimeout';
import AgentInfo from '../model/AgentInfo';
import { ApiResponse } from '../model/ApiResponse';
import { ButtonConfig } from '../model/configuration/ButtonConfig';

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

  public async triggerAction(id: string): Promise<ApiResponse> {
    return (
      await fetch(this.getUrl(`/api/actions/${id}`), { method: 'POST' })
    ).json();
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return (await fetch(this.getUrl('/api/actions/options'))).json();
  }

  private getUrl(path: string): string {
    return `${this.address}${path}`;
  }
}

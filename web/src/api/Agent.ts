import Configuration from '../model/configuration/Configuration';
import ActionOption from '../model/ActionOption';
import fetchTimeout from '../util/fetchTimeout';
import AgentInfo from '../model/AgentInfo';

export default class Agent {
  public constructor(private readonly address: string) {}

  private getUrl(path: string): string {
    return `${this.address}${path}`;
  }

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

  public async triggerAction(id: string): Promise<void> {
    console.log('Triggered:', id);
    await fetch(this.getUrl(`/api/actions/${id}`), { method: 'POST' });
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return (await fetch(this.getUrl('/api/actions/options'))).json();
  }
}

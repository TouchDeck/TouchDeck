import { Configuration } from './config';
import { ActionOption } from './actions';

export default class Agent {
  public constructor(private readonly address: string) {}

  private getUrl(path: string): string {
    return `${this.address}${path}`;
  }

  public async getConfiguration(): Promise<Configuration> {
    return (await fetch(this.getUrl('/api/config'))).json();
  }

  public async triggerAction(id: string): Promise<void> {
    console.log('Triggered:', id);
    await fetch(this.getUrl(`/api/actions/${id}`), { method: 'POST' });
  }

  public async getActionOptions(): Promise<ActionOption[]> {
    return (await fetch(this.getUrl('/api/actions/options'))).json();
  }
}

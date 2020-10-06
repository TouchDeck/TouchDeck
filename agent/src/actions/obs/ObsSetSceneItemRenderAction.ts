import ObsSocket from './ObsSocket';
import param, { Action, action, PreparedAction } from '../Action';

@action('OBS', 'Set Scene Item Render')
export default class ObsSetSceneItemRenderAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    @param('source') source: string,
    @param('render') render = false
  ): PreparedAction {
    return {
      invoke: () => this.invoke(source, render),
    };
  }

  private async invoke(source: string, render: boolean): Promise<void> {
    await (await this.obs.getSocket()).send('SetSceneItemRender', {
      source,
      render,
    });
  }
}

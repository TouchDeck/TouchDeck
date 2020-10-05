import ObsSocket from './ObsSocket';
import param, { Action, action } from '../Action';

@action('OBS', 'Set Scene Item Render')
export default class ObsSetSceneItemRenderAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(
    @param('source') source: string,
    @param('render') render: boolean = false
  ): Promise<void> {
    await (await this.obs.getSocket()).send('SetSceneItemRender', {
      source,
      render: render,
    });
  }
}

import ObsSocket from './ObsSocket';
import param, { Action, action, PreparedAction } from '../Action';

@action('OBS', 'Set Scene')
export default class ObsSetSceneAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(@param('scene') scene: string): PreparedAction {
    return {
      invoke: () => this.invoke(scene),
    };
  }

  private async invoke(scene: string): Promise<void> {
    await (await this.obs.getSocket()).send('SetCurrentScene', {
      'scene-name': scene,
    });
  }
}

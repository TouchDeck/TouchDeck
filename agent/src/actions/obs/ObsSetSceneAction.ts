import { ObsSocket } from './ObsSocket';
import { Action, action, param, PreparedAction } from '../Action';

@action('OBS', 'Set Scene')
export class ObsSetSceneAction implements Action {
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

import ObsSocket from './ObsSocket';
import param, { Action, action } from '../Action';

@action('OBS', 'Set Scene')
export default class ObsSetSceneAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(@param('scene') scene: string): Promise<void> {
    await this.obs.setScene(scene);
  }
}

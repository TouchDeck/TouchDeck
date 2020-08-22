import ObsSocket from '../../ObsSocket';
import Action, { action } from '../Action';

export interface Args {
  scene: string;
}

@action('OBS', 'Set Scene')
export default class ObsSetSceneAction implements Action<Args> {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(args: Args): Promise<void> {
    await this.obs.setScene(args.scene);
  }
}
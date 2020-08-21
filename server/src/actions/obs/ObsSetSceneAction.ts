import ObsSocket from '../../ObsSocket';
import Logger from '../../Logger';
import Action, { action } from '../Action';

export interface Args {
  scene: string;
}

@action('OBS', 'Set Scene')
export default class ObsSetSceneAction implements Action<Args> {
  private readonly log = new Logger(ObsSetSceneAction.name);

  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(args: Args): Promise<void> {
    this.log.debug(`Setting scene to: ${args.scene}`);
    await this.obs.setScene(args.scene);
  }
}

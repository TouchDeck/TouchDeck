import ObsSocket from '../../ObsSocket';
import Action, { action } from '../Action';

export interface Args {
  source: string;
  mute: boolean;
}

@action('OBS', 'Set Mute')
export default class ObsSetMuteAction implements Action<Args> {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(args: Args): Promise<void> {
    await this.obs.setMute(args.source, args.mute);
  }
}

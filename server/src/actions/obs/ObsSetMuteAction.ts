import ObsSocket from './ObsSocket';
import Action, { action } from '../Action';
import param from '../param';

@action('OBS', 'Set Mute')
export default class ObsSetMuteAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(
    @param('source') source: string,
    @param('mute') mute: boolean
  ): Promise<void> {
    await this.obs.setMute(source, mute);
  }
}

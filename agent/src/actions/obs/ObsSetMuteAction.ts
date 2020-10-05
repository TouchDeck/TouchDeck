import ObsSocket from './ObsSocket';
import param, { Action, action } from '../Action';

@action('OBS', 'Set Mute')
export default class ObsSetMuteAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(
    @param('source') source: string,
    @param('mute') mute: boolean
  ): Promise<void> {
    await (await this.obs.getSocket()).send('SetMute', {
      source,
      mute,
    });
  }
}

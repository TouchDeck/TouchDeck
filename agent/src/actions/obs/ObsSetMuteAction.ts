import ObsSocket from './ObsSocket';
import param, { Action, action, PreparedAction } from '../Action';

@action('OBS', 'Set Mute')
export default class ObsSetMuteAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    @param('source') source: string,
    @param('mute') mute: boolean
  ): PreparedAction {
    return {
      invoke: () => this.invoke(source, mute),
    };
  }

  private async invoke(source: string, mute: boolean): Promise<void> {
    await (await this.obs.getSocket()).send('SetMute', {
      source,
      mute,
    });
  }
}

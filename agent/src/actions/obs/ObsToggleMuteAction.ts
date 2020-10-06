import ObsSocket from './ObsSocket';
import param from '../Action';
import ToggleAction, {
  PreparedToggleAction,
  toggleAction,
} from '../ToggleAction';

@toggleAction('OBS', 'Toggle Mute')
export default class ObsToggleMuteAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(@param('source') source: string): PreparedToggleAction {
    return {
      invoke: () => this.invoke(source),
      getState: () => this.getState(source),
    };
  }

  private async invoke(source: string): Promise<void> {
    const muted = await this.getState(source);
    await (await this.obs.getSocket()).send('SetMute', {
      source,
      mute: !muted,
    });
  }

  private async getState(source: string): Promise<boolean> {
    return (await this.obs.getSocket())
      .send('GetMute', { source })
      .then((o) => o.muted);
  }
}

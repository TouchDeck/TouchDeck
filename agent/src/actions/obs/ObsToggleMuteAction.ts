import ObsSocket from './ObsSocket';
import param from '../Action';
import ToggleAction, {
  PreparedToggleAction,
  toggleAction,
} from '../ToggleAction';

@toggleAction('OBS', 'Toggle Mute')
export default class ObsToggleMuteAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    onStateChange: (state: boolean) => void,
    @param('source') source: string
  ): PreparedToggleAction {
    const handler = (event: { sourceName: string; muted: boolean }): void => {
      if (event.sourceName === source) {
        onStateChange(event.muted);
      }
    };
    this.obs.getSocketRaw().on('SourceMuteStateChanged', handler);

    return {
      invoke: () => this.invoke(source),
      getState: () => this.getState(source),
      unPrepare: () =>
        this.obs
          .getSocketRaw()
          .removeListener('SourceMuteStateChanged', handler),
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
    return this.obs
      .getSocket()
      .then((s) => s.send('GetMute', { source }))
      .then((o) => o.muted)
      .catch(() => false);
  }
}

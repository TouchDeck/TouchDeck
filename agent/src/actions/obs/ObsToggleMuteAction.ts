import { ObsSocket } from './ObsSocket';
import { param } from '../Action';
import {
  ToggleAction,
  PreparedToggleAction,
  toggleAction,
  ToggleChangeListener,
} from '../ToggleAction';

@toggleAction('OBS', 'Toggle Mute', {
  trueStateName: 'muted',
  falseStateName: 'unmuted',
})
export class ObsToggleMuteAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(@param('source') source: string): PreparedToggleAction {
    let handler: (event: { sourceName: string; muted: boolean }) => void;
    let connectHandler: () => void;

    return {
      invoke: () => this.invoke(source),
      getState: () => this.getState(source),
      registerChangeListener: (listener: ToggleChangeListener) => {
        handler = (event: { sourceName: string; muted: boolean }): void => {
          if (event.sourceName === source) {
            listener(event.muted);
          }
        };
        connectHandler = () => listener();

        this.obs.getSocketRaw().on('SourceMuteStateChanged', handler);
        this.obs.getSocketRaw().on('ConnectionOpened', connectHandler);
      },
      removeChangeListener: () => {
        this.obs
          .getSocketRaw()
          .removeListener('SourceMuteStateChanged', handler);
        this.obs
          .getSocketRaw()
          .removeListener('ConnectionOpened', connectHandler);
      },
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

import {
  PreparedToggleAction,
  toggleAction,
  ToggleAction,
  ToggleChangeListener,
} from '../ToggleAction';
import { ObsSocket } from './ObsSocket';
import { param } from '../Action';

@toggleAction('OBS', 'Toggle Source Filter', {
  trueStateName: 'enabled',
  falseStateName: 'disabled',
})
export class ObsToggleSourceFilterAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    @param('source') source: string,
    @param('filter') filter: string
  ): PreparedToggleAction {
    let handler: (event: {
      sourceName: string;
      filterName: string;
      filterEnabled: boolean;
    }) => void;
    let connectHandler: () => void;

    return {
      invoke: () => this.invoke(source, filter),
      getState: () => this.getState(source, filter),
      registerChangeListener: (listener: ToggleChangeListener) => {
        handler = (event) => {
          if (event.sourceName === source && event.filterName === filter) {
            listener(event.filterEnabled);
          }
        };
        connectHandler = () => listener();

        this.obs.getSocketRaw().on('SourceFilterVisibilityChanged', handler);
        this.obs.getSocketRaw().on('ConnectionOpened', connectHandler);
      },
      removeChangeListener: () => {
        this.obs
          .getSocketRaw()
          .removeListener('SourceFilterVisibilityChanged', handler);
        this.obs
          .getSocketRaw()
          .removeListener('ConnectionOpened', connectHandler);
      },
    };
  }

  private async invoke(source: string, filter: string): Promise<void> {
    const enabled = await this.getState(source, filter);
    await (await this.obs.getSocket()).send('SetSourceFilterVisibility', {
      sourceName: source,
      filterName: filter,
      filterEnabled: !enabled,
    });
  }

  private async getState(source: string, filter: string): Promise<boolean> {
    return this.obs
      .getSocket()
      .then((s) =>
        s.send('GetSourceFilterInfo', {
          sourceName: source,
          filterName: filter,
        })
      )
      .then((o) => o.enabled)
      .catch(() => false);
  }
}

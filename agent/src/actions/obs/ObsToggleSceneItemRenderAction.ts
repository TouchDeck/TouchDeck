import { ObsSocket } from './ObsSocket';
import { param } from '../Action';
import {
  ToggleAction,
  PreparedToggleAction,
  toggleAction,
  ToggleChangeListener,
} from '../ToggleAction';

@toggleAction('OBS', 'Toggle Scene Item Render', {
  trueStateName: 'visible',
  falseStateName: 'hidden',
})
export class ObsToggleSceneItemRenderAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(@param('source') source: string): PreparedToggleAction {
    let handler: (event: {
      'item-name': string;
      'item-visible': boolean;
    }) => void;
    let connectHandler: () => void;

    return {
      invoke: () => this.invoke(source),
      getState: () => this.getState(source),
      registerChangeListener: (listener: ToggleChangeListener) => {
        handler = (event: {
          'item-name': string;
          'item-visible': boolean;
        }): void => {
          if (event['item-name'] === source) {
            listener(event['item-visible']);
          }
        };
        connectHandler = () => listener();

        this.obs.getSocketRaw().on('SceneItemVisibilityChanged', handler);
        this.obs.getSocketRaw().on('ConnectionOpened', connectHandler);
      },
      removeChangeListener: () => {
        this.obs
          .getSocketRaw()
          .removeListener('SceneItemVisibilityChanged', handler);
        this.obs
          .getSocketRaw()
          .removeListener('ConnectionOpened', connectHandler);
      },
    };
  }

  private async invoke(source: string): Promise<void> {
    const render = await this.getState(source);
    await (await this.obs.getSocket()).send('SetSceneItemRender', {
      source,
      render: !render,
    });
  }

  private async getState(source: string): Promise<boolean> {
    return this.obs
      .getSocket()
      .then((s) => s.send('GetSceneItemProperties', { item: { name: source } }))
      .then((o) => o.visible)
      .catch(() => false);
  }
}

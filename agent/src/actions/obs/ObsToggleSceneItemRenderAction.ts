import ObsSocket from './ObsSocket';
import param from '../Action';
import ToggleAction, {
  PreparedToggleAction,
  toggleAction,
} from '../ToggleAction';

@toggleAction('OBS', 'Toggle Scene Item Render')
export default class ObsToggleSceneItemRenderAction implements ToggleAction {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    onStateChange: (state: boolean) => void,
    @param('source') source: string
  ): PreparedToggleAction {
    return {
      invoke: () => this.invoke(source),
      getState: () => this.getState(source),
      unPrepare: () => undefined,
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
      .then((s) => s.send('GetSceneItemProperties', { item: source }))
      .then((o) => o.visible)
      .catch(() => false);
  }
}

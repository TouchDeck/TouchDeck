import ObsSocket from './ObsSocket';
import { Action, action, param, PreparedAction } from '../Action';

@action('OBS', 'Set Volume')
export default class ObsSetVolumeAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public prepare(
    @param('source') source: string,
    @param('volume') volume: number,
    @param('use decibel') useDecibel: boolean
  ): PreparedAction {
    return {
      invoke: () => this.invoke(source, volume, useDecibel),
    };
  }

  private async invoke(
    source: string,
    volume: number,
    useDecibel: boolean
  ): Promise<void> {
    await (await this.obs.getSocket()).send('SetVolume', {
      source,
      volume,
      // @ts-ignore useDecibel is a valid property, but does not exist in the type definition.
      useDecibel,
    });
  }
}

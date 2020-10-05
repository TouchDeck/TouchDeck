import ObsSocket from './ObsSocket';
import param, { Action, action } from '../Action';

@action('OBS', 'Set Volume')
export default class ObsSetVolumeAction implements Action {
  public constructor(private readonly obs: ObsSocket) {}

  public async invoke(
    @param('source') source: string,
    @param('volume') volume: number,
    @param('use decibel') useDecibel: boolean
  ): Promise<void> {
    await (await this.obs.getSocket()).send('SetVolume', {
      source,
      volume,
      // @ts-ignore useDecibel is a valid property, but does not exist in the type definition.
      useDecibel,
    });
  }
}

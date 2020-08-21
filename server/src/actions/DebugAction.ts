import Logger from '../Logger';
import Action, { action } from './Action';

export interface Args {
  value: string;
}

@action('', 'Debug')
export default class DebugAction implements Action<Args> {
  private readonly log = new Logger(DebugAction.name);

  public invoke(args: Args): void {
    this.log.debug(`Invoked debug action with "${args.value}"`);
  }
}

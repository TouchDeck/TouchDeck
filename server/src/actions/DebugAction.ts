import Action from './Action';
import Logger from '../Logger';

export interface Args {
  value: string;
}

export default class DebugAction implements Action<Args> {
  private readonly log = new Logger(DebugAction.name);

  public invoke(args: Args): void {
    this.log.debug(`Invoked debug action with ${args.value}`);
  }
}

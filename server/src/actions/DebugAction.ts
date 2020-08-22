import Logger from '../Logger';
import Action, { action } from './Action';
import param from './param';

@action('', 'Debug')
export default class DebugAction implements Action {
  private readonly log = new Logger(DebugAction.name);

  public invoke(@param('value') value: string): void {
    this.log.debug(`Invoked debug action with "${value}"`);
  }
}

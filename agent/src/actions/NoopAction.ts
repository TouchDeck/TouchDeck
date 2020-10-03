import { action, Action } from './Action';

@action('', 'No-op')
export default class NoopAction implements Action {
  // eslint-disable-next-line class-methods-use-this
  public invoke(): void {
    return undefined;
  }
}

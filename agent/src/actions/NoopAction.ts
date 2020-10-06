import { action, Action, PreparedAction } from './Action';

@action('', 'No-op')
export default class NoopAction implements Action {
  // eslint-disable-next-line class-methods-use-this
  public prepare(): PreparedAction {
    return {
      invoke: () => undefined,
    };
  }
}

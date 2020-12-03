import { action, PreparedAction } from './Action';
import { Constructor } from '../util/Constructor';
import { ToggleActionInfo } from '../model/ActionOption';

export default interface ToggleAction {
  prepare(
    onStateChange: (state: boolean) => void,
    ...args: unknown[]
  ): PreparedToggleAction;
}

export interface PreparedToggleAction extends PreparedAction {
  getState(): boolean | Promise<boolean>;
  unPrepare(): void;
}

export const actionToggleableKey = Symbol('action:toggleable');
export const actionToggleInfoKey = Symbol('action:toggle-info');

export function toggleAction(
  category: string,
  name: string,
  info: ToggleActionInfo
) {
  return function defineAction<T extends Constructor>(ctor: T): void {
    action(category, name)(ctor);
    Reflect.defineMetadata(actionToggleableKey, true, ctor.prototype);
    Reflect.defineMetadata(actionToggleInfoKey, info, ctor.prototype);
  };
}

export function isPreparedToggleAction(
  a: PreparedAction
): a is PreparedToggleAction {
  return 'getState' in a;
}

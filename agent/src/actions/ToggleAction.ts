import { action, PreparedAction } from './Action';
import { Constructor } from '../util/Constructor';

export default interface ToggleAction {
  prepare(...args: unknown[]): PreparedToggleAction;
}

export interface PreparedToggleAction extends PreparedAction {
  getState(): boolean | Promise<boolean>;
}

export const actionToggleableKey = Symbol('action:toggleable');

export function toggleAction(category: string, name: string) {
  return function defineAction<T extends Constructor>(ctor: T): void {
    action(category, name)(ctor);
    Reflect.defineMetadata(actionToggleableKey, true, ctor.prototype);
  };
}

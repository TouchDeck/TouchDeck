import { ToggleActionInfo } from 'touchdeck-model';
import { action, PreparedAction } from './Action';
import { Constructor } from '../util/Constructor';

export interface ToggleAction {
  prepare(...args: unknown[]): PreparedToggleAction;
}

export type ToggleChangeListener = (newState?: boolean) => void;

export interface PreparedToggleAction extends PreparedAction {
  getState(): boolean | Promise<boolean>;
  registerChangeListener(listener: ToggleChangeListener): void;
  removeChangeListener(): void;
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

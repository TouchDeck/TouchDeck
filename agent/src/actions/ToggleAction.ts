import { PreparedAction } from './Action';

export default interface ToggleAction {
  prepare(...args: unknown[]): PreparedToggleAction;
}

export interface PreparedToggleAction extends PreparedAction {
  getState(): boolean | Promise<boolean>;
}

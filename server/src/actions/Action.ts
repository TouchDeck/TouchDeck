import { Constructor } from '../util/Constructor';
import 'reflect-metadata';

export default interface Action {
  invoke(...args: unknown[]): void | Promise<void>;
}

export const actionCategoryKey = Symbol('action:category');
export const actionNameKey = Symbol('action:name');

export function action(category: string, name: string) {
  return function defineAction<T extends Constructor>(ctor: T): void {
    Reflect.defineMetadata(actionCategoryKey, category, ctor.prototype);
    Reflect.defineMetadata(actionNameKey, name, ctor.prototype);
  };
}

import { Constructor } from '../Constructor';
import 'reflect-metadata';

// We want to use `object` here instead of `Record<string, unknown>` because otherwise the args type becomes too convoluted.
// eslint-disable-next-line @typescript-eslint/ban-types
export default interface Action<T extends object> {
  invoke(args: T): void;
}

export const actionCategoryKey = 'action:category';
export const actionNameKey = 'action:name';

export function action(category: string, name: string) {
  return function defineAction<T extends Constructor>(ctor: T): void {
    Reflect.defineMetadata(actionCategoryKey, category, ctor.prototype);
    Reflect.defineMetadata(actionNameKey, name, ctor.prototype);
  };
}

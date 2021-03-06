import 'reflect-metadata';
import { ActionParameter } from 'touchdeck-model';
import { Constructor } from '../util/Constructor';
import { singleton } from '../Injector';

export interface Action {
  prepare(...args: unknown[]): PreparedAction;
}

export interface PreparedAction {
  invoke(): void | Promise<void>;
}

export const actionCategoryKey = Symbol('action:category');
export const actionNameKey = Symbol('action:name');
export const actionParamsKey = Symbol('action:params');

/**
 * Define an action.
 *
 * @param category The category the action belongs to.
 * @param name The name of the action.
 */
export function action(category: string, name: string) {
  return function defineAction<T extends Constructor>(ctor: T): void {
    // Store the category and name as metadata on the prototype.
    Reflect.defineMetadata(actionCategoryKey, category, ctor.prototype);
    Reflect.defineMetadata(actionNameKey, name, ctor.prototype);

    // All actions are singletons.
    singleton(ctor);
  };
}

/**
 * Define a parameter for an action.
 * This should be used on all parameters on the `invoke` function.
 *
 * The second parameter of the decorator can be a custom type for the parameter.
 * This can be used to display a specific control in the frontend.
 * The underlying type used for this will always be a string.
 *
 * @param name The name of the parameter.
 * @param customType The (optional) type of the parameter.
 */
export function param(name: string, customType?: ActionParameter['type']) {
  return function defineParam(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    // Get the current parameter info list from the prototype.
    const params: ActionParameter[] =
      Reflect.getMetadata(actionParamsKey, target) || [];

    // Get the type name for this parameter.
    const paramTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey
    );
    const type = customType || paramTypes[parameterIndex].name.toLowerCase();

    // Add the parameter info for this parameter.
    params[parameterIndex] = {
      name,
      type,
    };

    // Store the parameter info list as metadata on the action prototype.
    Reflect.defineMetadata(actionParamsKey, params, target);
  };
}

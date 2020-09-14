import { ActionParameter } from '../model/ActionOption';

export const actionParamsKey = Symbol('action:params');

export default function param(name: string) {
  return function defineArg(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    const params: ActionParameter[] =
      Reflect.getMetadata(actionParamsKey, target) || [];
    params[parameterIndex] = {
      name,
      type: 'string', // TODO
    };
    Reflect.defineMetadata(actionParamsKey, params, target);
  };
}

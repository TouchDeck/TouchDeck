export const paramNamesKey = Symbol('param:names');

export default function param(name: string) {
  return function defineArg(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    const paramNames: string[] =
      Reflect.getMetadata(paramNamesKey, target, propertyKey) || [];
    paramNames[parameterIndex] = name;
    Reflect.defineMetadata(paramNamesKey, paramNames, target, propertyKey);
  };
}

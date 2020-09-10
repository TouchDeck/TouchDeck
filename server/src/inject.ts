import 'reflect-metadata';
import { Constructor } from './Constructor';

export const singletonKey = Symbol('inject:singleton');

const singletonInstances: { [key: string]: unknown } = {};

export default function inject<T>(Target: Constructor<T>): T {
  const ctorParams = Reflect.getMetadata('design:paramtypes', Target) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const injections = ctorParams.map((param: any) => {
    // Check if the param is a singleton.
    const isSingleton = Reflect.getMetadata(singletonKey, param.prototype);
    if (isSingleton) {
      let instance = singletonInstances[param];

      // If no instance exists, inject one and store it.
      if (!instance) {
        instance = inject(param);
        singletonInstances[param] = instance;
      }

      return instance;
    }

    // If the param is not a singleton, inject a new one.
    return inject(param);
  });

  return new Target(...injections);
}

export function singleton<T extends Constructor>(ctor: T): void {
  Reflect.defineMetadata(singletonKey, true, ctor.prototype);
}

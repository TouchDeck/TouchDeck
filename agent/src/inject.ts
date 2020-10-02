import 'reflect-metadata';
import { Constructor } from './util/Constructor';

const singletonKey = Symbol('inject:singleton');

const singletonInstances: { [key: string]: unknown } = {};

/**
 * Create an instance of a class, injecting all necessary arguments in the constructor.
 *
 * @param Target The target constructor to inject.
 */
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

/**
 * A decorator that indicates only a single instance of an injectable class should be constructed.
 *
 * @param ctor The singleton class.
 */
export function singleton<T extends Constructor>(ctor: T): void {
  Reflect.defineMetadata(singletonKey, true, ctor.prototype);
}

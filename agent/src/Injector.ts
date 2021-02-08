import 'reflect-metadata';
import { Constructor } from './util/Constructor';

const singletonKey = Symbol('inject:singleton');

/**
 * A decorator that indicates only a single instance of an injectable class should be constructed.
 *
 * @param ctor The singleton class.
 */
export function singleton<T extends Constructor>(ctor: T): void {
  Reflect.defineMetadata(singletonKey, true, ctor.prototype);
}

@singleton
export class Injector {
  private readonly singletonInstances: { [key: string]: unknown } = {};

  public constructor() {
    this.singletonInstances[Injector.toString()] = this;
  }

  /**
   * Get an instance of a class.
   *
   * @param Target The target constructor to get an instance of.
   */
  public getInstance<T>(Target: Constructor<T>): T {
    // Check if the class is a singleton.
    const isSingleton = Reflect.getMetadata(singletonKey, Target.prototype);

    // If it's a singleton, check the available singleton instances.
    if (isSingleton) {
      const targetKey = Target.toString();
      let instance = this.singletonInstances[targetKey];

      // If no instance exists, inject one and store it.
      if (!instance) {
        instance = this.inject(Target);
        this.singletonInstances[targetKey] = instance;
      }

      return instance as T;
    }

    // If the class is not a singleton, inject a new instance.
    return this.inject(Target);
  }

  public storeSingleton(instance: unknown): void {
    if (instance && typeof instance === 'object' && 'constructor' in instance) {
      this.singletonInstances[instance.constructor.toString()] = instance;
    } else {
      throw new Error(`Cannot store singleton of instance: ${typeof instance}`);
    }
  }

  /**
   * Create a new instance of a class, injecting all necessary arguments in the constructor.
   *
   * @param Target The target constructor to inject.
   */
  private inject<T>(Target: Constructor<T>): T {
    const ctorParams = Reflect.getMetadata('design:paramtypes', Target) || [];

    // Get instances of all constructor parameters.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const injections = ctorParams.map((param: any) => this.getInstance(param));

    return new Target(...injections);
  }
}

import 'reflect-metadata';
import { Constructor } from './Constructor';

export default function inject<T>(Target: Constructor<T>): T {
  const ctorParams = Reflect.getMetadata('design:paramtypes', Target) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const injections = ctorParams.map((param: any) => inject(param));
  return new Target(...injections);
}

// We want to use `object` here instead of `Record<string, unknown>` because otherwise the args type becomes too convoluted.
// eslint-disable-next-line @typescript-eslint/ban-types
export default interface Action<T extends object> {
  invoke(args: T): void;
}

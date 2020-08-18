export default interface Action<T extends Record<string, unknown>> {
  invoke(args: T): void;
}

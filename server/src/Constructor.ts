// The `any` is necessary here to match any constructor parameters.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = unknown> = { new (...args: any[]): T };

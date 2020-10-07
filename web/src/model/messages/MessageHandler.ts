export type MessageHandler<T = unknown, R = void> = (data: T) => R | Promise<R>;

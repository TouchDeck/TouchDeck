export interface Message<T = unknown> {
  type: string;
  messageId: string;
  replyTo?: string;
  data: T;
}

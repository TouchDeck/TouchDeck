export interface SocketMessage<T> {
  type: string;
  messageId: string;
  replyTo?: string;
  data: T;
}

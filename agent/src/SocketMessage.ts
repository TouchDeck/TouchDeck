export interface SocketMessage {
  type: string;
  messageId: string;
  replyTo?: string;
  data: unknown;
}

export interface GetInfoRequest extends SocketMessage {
  type: 'get-info';
}

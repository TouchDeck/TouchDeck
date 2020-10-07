import ReconnectingWebSocket from 'reconnecting-websocket';
import { MessageHandler } from './model/messages/MessageHandler';

export interface WebSocketMessage {
  type: string;
  messageId: string;
  replyTo?: string;
  data?: unknown;
}

export default class WebSocketClient {
  private readonly socket: ReconnectingWebSocket;

  private messageIdCounter = 0;
  private responsePromises: {
    [messageId: string]: MessageHandler;
  } = {};

  private messageHandlers: {
    [type: string]: MessageHandler;
  } = {};

  public constructor(address: string) {
    this.socket = new ReconnectingWebSocket(address);
    this.socket.addEventListener('message', (event) =>
      this.handleMessage(event)
    );
  }

  public registerHandler<T>(type: string, handler: MessageHandler<T>): void {
    this.messageHandlers[type] = handler as MessageHandler;
  }

  public send<T, R>(type: string, data?: T): Promise<R> {
    const message: WebSocketMessage = {
      type,
      messageId: (this.messageIdCounter++).toString(),
      data,
    };

    // Store the reply handler promise.
    const replyPromise = new Promise((resolve) => {
      this.responsePromises[message.messageId] = resolve;
    });

    this.socket.send(JSON.stringify(message));

    return replyPromise as Promise<R>;
  }

  private handleMessage(event: MessageEvent): void {
    const message: WebSocketMessage = JSON.parse(event.data.toString());

    if (message.replyTo) {
      // If the message has a replyTo, invoke the reply handler.
      const responseHandler = this.responsePromises[message.replyTo];

      // Check if we have a message handler.
      if (responseHandler) {
        delete this.responsePromises[message.replyTo];
        Promise.resolve(responseHandler(message.data)).catch((err) =>
          console.error(`Error while handling "${message.type}" message:`, err)
        );
      } else {
        console.error(
          `No handler found for message reply "${message.replyTo}", dropping.`
        );
      }
    } else {
      // This is a normal message, invoke the type handler.
      const handler = this.messageHandlers[message.type];

      // Check if we have a message handler.
      if (handler) {
        handler(message.data);
      } else {
        console.log(`Unhandled message type "${message.type}", dropping.`);
      }
    }
  }
}

import ReconnectingWebSocket from 'reconnecting-websocket';
import sanitizeWsAddress from './util/sanitizeWsAddress';
import { MessageDataMap, MessageResponseMap } from './model/messages/messages';
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
    [type: string]: MessageHandler<unknown, unknown>;
  } = {};

  public constructor(address: string) {
    this.socket = new ReconnectingWebSocket(`${sanitizeWsAddress(address)}/ws`);
    this.socket.addEventListener('message', (event) =>
      this.handleMessage(event)
    );
  }

  public registerHandler<T extends keyof MessageDataMap>(
    type: T,
    handler: MessageHandler<MessageDataMap[T], MessageResponseMap[T]>
  ): void {
    this.messageHandlers[type.toString()] = handler as MessageHandler<
      unknown,
      unknown
    >;
  }

  public send<T extends keyof MessageDataMap>(
    type: T,
    ...args: MessageDataMap[T] extends void ? [undefined?] : [MessageDataMap[T]]
  ): Promise<MessageResponseMap[T]> {
    const message: WebSocketMessage = {
      type: type.toString(),
      messageId: (this.messageIdCounter++).toString(),
      data: args[0],
    };

    // Store the reply handler promise.
    const replyPromise = new Promise((resolve) => {
      this.responsePromises[message.messageId] = resolve;
    });

    this.socket.send(JSON.stringify(message));

    return replyPromise as Promise<MessageResponseMap[T]>;
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
        console.error(`Unhandled message type "${message.type}", dropping.`);
      }
    }
  }
}

import {
  MessageDataMap,
  MessageHandler,
  MessageResponseMap,
} from 'touchdeck-model';

export interface WebSocketMessage {
  type: string;
  messageId: string;
  replyTo?: string;
  data?: unknown;
}

export class WebSocketClient {
  private socket?: WebSocket;

  private messageIdCounter = 0;
  private responsePromises: {
    [messageId: string]: MessageHandler;
  } = {};

  private messageHandlers: {
    [type: string]: MessageHandler<unknown, unknown>;
  } = {};

  public constructor(private readonly address: string) {}

  public connect(): Promise<void> {
    this.socket = new WebSocket(this.address);
    this.socket.addEventListener('message', (event) =>
      this.handleMessage(event)
    );

    return new Promise((resolve, reject) => {
      this.socket?.addEventListener('open', () => resolve());
      this.socket?.addEventListener('error', () => reject());
    });
  }

  public onDisconnect(handler: () => void): void {
    this.socket?.addEventListener('close', handler);
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

  public sendRaw(msg: string): void {
    if (!this.socket) {
      throw new Error('No agent socket connection available.');
    }

    this.socket.send(msg);
  }

  public send<T extends keyof MessageDataMap>(
    type: T,
    ...args: MessageDataMap[T] extends void ? [undefined?] : [MessageDataMap[T]]
  ): Promise<MessageResponseMap[T]> {
    if (!this.socket) {
      throw new Error('No agent socket connection available.');
    }

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
        // This happens when multiple remotes are connected to a single agent.
        console.debug(
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

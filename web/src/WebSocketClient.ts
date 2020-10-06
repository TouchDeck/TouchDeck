import ReconnectingWebSocket from 'reconnecting-websocket';

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
    [messageId: string]: (data: unknown) => void;
  } = {};

  public constructor(address: string) {
    this.socket = new ReconnectingWebSocket(address);
    this.socket.addEventListener('message', (event) =>
      this.handleMessage(event)
    );
  }

  public send<R>(type: string): Promise<R> {
    const message: WebSocketMessage = {
      type,
      messageId: (this.messageIdCounter++).toString(),
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
      if (!responseHandler) {
        console.error(
          `No handler found for message reply "${message.replyTo}", dropping.`
        );
        return;
      }

      delete this.responsePromises[message.replyTo];
      responseHandler(message.data);
    } else {
      // This is a normal message, invoke the type handler.
      // TODO
      console.log('Unhandled message', message);
    }
  }
}

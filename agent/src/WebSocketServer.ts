import WebSocket, { Data, Server } from 'ws';
import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import { WS_PORT } from './constants';
import { SocketMessage } from './SocketMessage';

export type SocketMessageHandler<T, R> = (data: T) => R | Promise<R>;

export default class WebSocketServer {
  private static log = new Logger(WebSocketServer.name);

  private readonly server: Server;

  private readonly handlers: {
    [type: string]: SocketMessageHandler<unknown, unknown>;
  } = {};

  public constructor() {
    this.server = new Server({
      port: WS_PORT,
    });

    this.server.on('connection', (ws) => this.handleConnection(ws));
  }

  public registerHandler<T, R>(
    type: string,
    handler: SocketMessageHandler<T, R>
  ): void {
    this.handlers[type] = handler as SocketMessageHandler<unknown, unknown>;
  }

  private handleConnection(ws: WebSocket): void {
    WebSocketServer.log.debug('New connection');
    ws.on('message', (data) => this.handleMessage(ws, data));
  }

  private async handleMessage(ws: WebSocket, data: Data): Promise<void> {
    const message: SocketMessage<unknown> = JSON.parse(data.toString());
    const handler = this.handlers[message.type];

    if (!handler) {
      WebSocketServer.log.error(
        `No handler registered for type: ${message.type}`
      );
      return;
    }

    const responseData = await Promise.resolve(handler(message.data));
    const response: SocketMessage<unknown> = {
      type: `${message.type}-response`,
      messageId: uuidv4(),
      replyTo: message.messageId,
      data: responseData,
    };
    ws.send(JSON.stringify(response));
  }
}

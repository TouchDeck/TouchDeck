import WebSocket, { AddressInfo, Data, Server } from 'ws';
import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import Message from './model/messages/Message';
import { MessageHandler } from './model/messages/MessageHandler';

export default class WebSocketServer {
  private static log = new Logger(WebSocketServer.name);

  private readonly server: Server;

  private readonly handlers: {
    [type: string]: MessageHandler<unknown, unknown>;
  } = {};

  public constructor() {
    this.server = new Server({ port: 0 });
    this.server.on('connection', (ws) => this.handleConnection(ws));
  }

  public address(): AddressInfo {
    return this.server.address() as AddressInfo;
  }

  public registerHandler<T, R>(
    type: string,
    handler: MessageHandler<T, R>
  ): void {
    this.handlers[type] = handler as MessageHandler<unknown, unknown>;
  }

  private handleConnection(ws: WebSocket): void {
    WebSocketServer.log.debug('New connection');
    ws.on('message', (data) => this.handleMessage(ws, data));
  }

  private async handleMessage(ws: WebSocket, data: Data): Promise<void> {
    const message: Message = JSON.parse(data.toString());
    const handler = this.handlers[message.type];

    if (!handler) {
      WebSocketServer.log.error(
        `No handler registered for type: ${message.type}`
      );
      return;
    }

    const responseData = await Promise.resolve(handler(message.data));
    const response: Message = {
      type: `${message.type}-response`,
      messageId: uuidv4(),
      replyTo: message.messageId,
      data: responseData,
    };
    ws.send(JSON.stringify(response));
  }
}

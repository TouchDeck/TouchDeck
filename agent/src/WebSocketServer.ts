import WebSocket, { AddressInfo, Data, Server, ServerOptions } from 'ws';
import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import Message from './model/messages/Message';
import { MessageHandler } from './model/messages/MessageHandler';
import { MessageDataMap, MessageResponseMap } from './model/messages/messages';

export default class WebSocketServer {
  private static log = new Logger(WebSocketServer.name);

  public readonly server: Server;

  private readonly handlers: {
    [type: string]: MessageHandler<unknown, unknown>;
  } = {};

  public constructor(options: ServerOptions) {
    this.server = new Server(options);
    this.server.addListener('connection', (ws) => this.handleConnection(ws));
  }

  public address(): AddressInfo {
    return this.server.address() as AddressInfo;
  }

  public registerHandler<T extends keyof MessageDataMap>(
    type: T,
    handler: MessageHandler<MessageDataMap[T], MessageResponseMap[T]>
  ): void {
    this.handlers[type] = handler as MessageHandler<unknown, unknown>;
  }

  public send<T extends keyof MessageDataMap>(
    type: T,
    data: MessageDataMap[T],
    replyTo?: string
  ): void {
    const msg: Message = {
      type,
      replyTo,
      messageId: uuidv4(),
      data,
    };
    this.broadcast(JSON.stringify(msg));
  }

  private broadcast(data: string): void {
    this.server.clients.forEach((ws) => ws.send(data));
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

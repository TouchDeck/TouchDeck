import WebSocket, { Data, Server } from 'ws';
import { WS_PORT } from './constants';
import { Logger } from '@luca_scorpion/tinylogger';
import { SocketMessage } from './SocketMessage';
import { v4 as uuidv4 } from 'uuid';

export type SocketMessageHandler = (message: SocketMessage) => unknown;

export default class WebSocketServer {
  private static log = new Logger(WebSocketServer.name);

  private readonly server: Server;
  private readonly handlers: { [type: string]: SocketMessageHandler } = {};

  public constructor() {
    this.server = new Server({
      port: WS_PORT
    });

    this.server.on('connection', (ws) => this.handleConnection(ws));
  }

  public registerHandler(type: string, handler: SocketMessageHandler): void {
    this.handlers[type] = handler;
  }

  private handleConnection(ws: WebSocket): void {
    WebSocketServer.log.debug('New connection');
    ws.on('message', (data) => this.handleMessage(ws, data));
  }

  private async handleMessage(ws: WebSocket, data: Data): Promise<void> {
    const message: SocketMessage = JSON.parse(data.toString());
    const handler = this.handlers[message.type];

    if (!handler) {
      WebSocketServer.log.error(`No handler registered for type: ${message.type}`);
      return;
    }

    const responseData = await Promise.resolve(handler(message));
    const response: SocketMessage = {
      type: `${message.type}-response`,
      messageId: uuidv4(),
      replyTo: message.messageId,
      data: responseData
    }
    ws.send(JSON.stringify(response));
  }
}

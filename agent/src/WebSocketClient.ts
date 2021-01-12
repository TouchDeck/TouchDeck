import { Logger } from '@luca_scorpion/tinylogger';
import WebSocket, { Data } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import getAgentMeta from './util/getAgentMeta';
import { MessageHandler } from './model/messages/MessageHandler';
import { MessageDataMap, MessageResponseMap } from './model/messages/messages';
import Message from './model/messages/Message';

export default class WebSocketClient {
  private static log = new Logger(WebSocketClient.name);

  private readonly client: WebSocket;

  private readonly handlers: {
    [type: string]: MessageHandler<unknown, unknown>;
  } = {};

  public constructor() {
    this.client = new WebSocket('wss://wsproxy.touchdeck.app/ws/agent');

    let registered = false;
    this.client.addEventListener('message', ({ target, data }) => {
      if (!registered) {
        registered = true;
        const { id } = JSON.parse(data.toString());
        WebSocketClient.log.info(`Registered agent: ${id}`);
        return;
      }

      this.handleMessage(target, data);
    });

    this.client.addEventListener('open', () => {
      WebSocketClient.log.debug('Connected to websocket proxy');
      this.client.send(
        JSON.stringify({
          meta: getAgentMeta(),
        })
      );
    });
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
    const msgString = JSON.stringify(msg);

    this.client.send(msgString);
  }

  public registerHandler<T extends keyof MessageDataMap>(
    type: T,
    handler: MessageHandler<MessageDataMap[T], MessageResponseMap[T]>
  ): void {
    this.handlers[type] = handler as MessageHandler<unknown, unknown>;
  }

  private async handleMessage(ws: WebSocket, data: Data): Promise<void> {
    const message: Message = JSON.parse(data.toString());
    const handler = this.handlers[message.type];

    if (!handler) {
      WebSocketClient.log.error(
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

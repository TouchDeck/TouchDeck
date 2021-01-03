import { Logger } from '@luca_scorpion/tinylogger';
import WebSocket from 'ws';
import getAgentMeta from './util/getAgentMeta';

export default class WebSocketClient {
  private static log = new Logger(WebSocketClient.name);

  private readonly client: WebSocket;

  public constructor() {
    this.client = new WebSocket('wss://wsproxy.touchdeck.app/ws/agent');
    this.client.addEventListener('open', () => {
      WebSocketClient.log.debug('Connected to WS proxy');
      this.client.send(
        JSON.stringify({
          meta: getAgentMeta(),
        })
      );
    });

    this.client.addEventListener('message', ({ data }) => {
      WebSocketClient.log.info(data.toString());
    });
  }
}

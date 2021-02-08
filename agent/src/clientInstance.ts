import WebSocketClient from './WebSocketClient';

let clientInstance: WebSocketClient;

export function getClientInstance(): WebSocketClient {
  return clientInstance;
}

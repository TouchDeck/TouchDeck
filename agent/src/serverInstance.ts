import WebSocketClient from './WebSocketClient';

let clientInstance: WebSocketClient;

export function setClientInstance(client: WebSocketClient): void {
  clientInstance = client;
}

export function getClientInstance(): WebSocketClient {
  return clientInstance;
}

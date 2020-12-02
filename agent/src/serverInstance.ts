import WebSocketServer from './WebSocketServer';

let serverInstance: WebSocketServer;

export function setServerInstance(server: WebSocketServer): void {
  serverInstance = server;
}

export function getServerInstance(): WebSocketServer {
  return serverInstance;
}

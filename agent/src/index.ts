import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { getAvailableActions } from './actions/actionRegistry';
import { PORT } from './constants';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
import WebSocketServer from './WebSocketServer';
import getActionOptions from './wsApi/getActionOptions';
import {
  deleteButton,
  updateConfig,
  updateLayout,
  upsertButton,
} from './wsApi/config';
import pressButton from './wsApi/pressButton';
import getAgentMeta from './util/getAgentMeta';
import { deleteImage, getImages, uploadImage } from './wsApi/images';
import sendButtonStates from './wsApi/sendButtonStates';
import { setServerInstance } from './serverInstance';
import WebSocketClient from './WebSocketClient';

const log = new Logger('index');
log.debug('Starting agent...');

async function bootstrap(): Promise<void> {
  // Load and log all the action classes.
  const availableActionClasses = getAvailableActions();
  log.debug(`Found ${availableActionClasses.length} action classes:`);
  availableActionClasses.forEach((action) =>
    log.debug(
      `  - ${action.category}/${action.name} (${action.constructor.name})`
    )
  );

  // Read and set the configuration.
  // Doing it this way allows us to validate on boot.
  await readConfiguration().then(setConfiguration);

  // Connect to the WS proxy.
  const client = new WebSocketClient();

  // Start the websocket server.
  log.debug('Starting websocket server');
  const server = new WebSocketServer({ port: PORT, path: '/ws' });
  setServerInstance(server);

  // Register all websocket server handlers.
  server.registerHandler('get-info', getAgentMeta);
  server.registerHandler('get-configuration', getConfiguration);
  server.registerHandler('set-configuration', updateConfig);
  server.registerHandler('upsert-configuration-button', upsertButton);
  server.registerHandler('delete-configuration-button', deleteButton);
  server.registerHandler('set-layout', updateLayout);
  server.registerHandler('get-action-options', getActionOptions);
  server.registerHandler('get-images', getImages);
  server.registerHandler('press-button', pressButton(server));
  server.registerHandler('upload-image', uploadImage);
  server.registerHandler('delete-image', deleteImage);

  // When a new connection is established, send all button states.
  // TODO: Make this not a broadcast, but only send to the newly connected client.
  server.server.addListener('connection', () => sendButtonStates(server));

  log.info(`Agent running on ${getAgentMeta().address}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

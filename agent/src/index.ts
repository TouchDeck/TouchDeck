import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { getAvailableActions } from './actions/actionRegistry';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
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
import { setClientInstance } from './serverInstance';
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
  log.debug('Connecting to websocket proxy');
  const client = new WebSocketClient();
  setClientInstance(client);

  // Register all websocket server handlers.
  client.registerHandler('get-info', getAgentMeta);
  client.registerHandler('get-configuration', getConfiguration);
  client.registerHandler('set-configuration', updateConfig);
  client.registerHandler('upsert-configuration-button', upsertButton);
  client.registerHandler('delete-configuration-button', deleteButton);
  client.registerHandler('set-layout', updateLayout);
  client.registerHandler('get-action-options', getActionOptions);
  client.registerHandler('get-images', getImages);
  client.registerHandler('press-button', pressButton(client));
  client.registerHandler('upload-image', uploadImage);
  client.registerHandler('delete-image', deleteImage);

  log.info(`Agent running on ${getAgentMeta().address}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

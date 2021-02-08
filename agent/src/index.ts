import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { Configuration } from 'touchdeck-model';
import { promises as fs } from 'fs';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
import {
  deleteButton,
  updateConfig,
  updateLayout,
  upsertButton,
} from './wsApi/config';
import pressButton from './wsApi/pressButton';
import getAgentMeta from './util/getAgentMeta';
import {
  deleteImage,
  getImages,
  renameImage,
  uploadImage,
} from './wsApi/images';
import { setClientInstance } from './clientInstance';
import WebSocketClient from './WebSocketClient';
import sendButtonStates from './wsApi/sendButtonStates';
import { CONFIG_DIR, IMAGES_DIR, WS_PROXY_SERVER } from './constants';
import { Injector } from './Injector';
import { getActionOptions } from './wsApi/getActionOptions';
import { ActionRegistry } from './actions/ActionRegistry';
import { ConfigManager } from './ConfigManager';

const log = new Logger('index');
log.debug('Starting agent...');

async function bootstrap(): Promise<void> {
  const injector = new Injector();

  // Assert that all required directories exist.
  await fs.stat(CONFIG_DIR).catch(() => fs.mkdir(CONFIG_DIR));
  await fs.stat(IMAGES_DIR).catch(() => fs.mkdir(IMAGES_DIR));

  // Load the configuration and store the ConfigManager instance in the injector.
  const configManager = await ConfigManager.load();
  injector.storeSingleton(configManager);

  // Read and set the configuration.
  // Doing it this way allows us to validate on boot.
  await readConfiguration().then(setConfiguration);

  // Connect to the WS proxy.
  log.debug(`Connecting to websocket proxy at ${WS_PROXY_SERVER}`);
  const client = new WebSocketClient(WS_PROXY_SERVER);
  setClientInstance(client);

  // Register all websocket server handlers.
  client.registerHandler('get-info', getAgentMeta);
  client.registerHandler(
    'get-configuration',
    (): Configuration => {
      // When a get-configuration message is received, this means a new client is connected.
      // So we broadcast all the current button states.
      sendButtonStates(client);
      return getConfiguration();
    }
  );
  client.registerHandler('set-configuration', updateConfig);
  client.registerHandler('upsert-configuration-button', upsertButton);
  client.registerHandler('delete-configuration-button', deleteButton);
  client.registerHandler('set-layout', updateLayout);
  client.registerHandler(
    'get-action-options',
    getActionOptions(injector.getInstance(ActionRegistry))
  );
  client.registerHandler('get-images', getImages);
  client.registerHandler('press-button', pressButton(client));
  client.registerHandler('upload-image', uploadImage);
  client.registerHandler('delete-image', deleteImage);
  client.registerHandler('rename-image', renameImage);

  log.info(`Agent running on ${getAgentMeta().address}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

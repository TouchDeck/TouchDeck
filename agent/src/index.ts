import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { Configuration } from 'touchdeck-model';
import { promises as fs } from 'fs';
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
import { ConfigApi } from './wsApi/ConfigApi';

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
      return configManager.config;
    }
  );

  const configApi = injector.getInstance(ConfigApi);
  client.registerHandler('set-configuration', configApi.updateConfig);
  client.registerHandler('upsert-configuration-button', configApi.upsertButton);
  client.registerHandler('delete-configuration-button', configApi.deleteButton);
  client.registerHandler('set-layout', configApi.updateLayout);

  client.registerHandler(
    'get-action-options',
    getActionOptions(injector.getInstance(ActionRegistry))
  );
  client.registerHandler('press-button', pressButton(client));

  client.registerHandler('get-images', getImages);
  client.registerHandler('upload-image', uploadImage);
  client.registerHandler('delete-image', deleteImage);
  client.registerHandler('rename-image', renameImage);

  log.info(`Agent running on ${getAgentMeta().address}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

import 'reflect-metadata';
import express from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { getAvailableActions } from './actions/actionRegistry';
import {
  DISCOVERY_REPORT_TIME,
  HTTP_PORT,
  IMAGES_DIR,
  PORT,
} from './constants';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
import reportAgentDiscovery from './util/reportAgentDiscovery';
import cors from './util/cors';
import WebSocketServer from './WebSocketServer';
import getActionOptions from './wsApi/getActionOptions';
import {
  deleteButton,
  updateConfig,
  updateLayout,
  upsertButton,
} from './wsApi/config';
import pressButton from './wsApi/pressButton';
import getAgentInfo from './util/getAgentInfo';

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

  log.debug('Starting express');
  const app = express();

  // Register all middleware.
  app.use(express.json());
  app.use(cors);
  app.use('/api/images', express.static(IMAGES_DIR));

  // Register the API routes.
  // app.get('/api/actions/states', getButtonStates);

  // Done!
  app.listen(HTTP_PORT);

  // Start the websocket server.
  const server = new WebSocketServer(PORT);
  const serverPort = server.address().port;

  // Register all websocket server handlers.
  server.registerHandler('get-info', () => getAgentInfo(serverPort));
  server.registerHandler('get-configuration', getConfiguration);
  server.registerHandler('set-configuration', updateConfig);
  server.registerHandler('upsert-configuration-button', upsertButton);
  server.registerHandler('delete-configuration-button', deleteButton);
  server.registerHandler('set-layout', updateLayout);
  server.registerHandler('get-action-options', getActionOptions);
  server.registerHandler('press-button', pressButton);

  log.info(`Agent running on ${getAgentInfo(serverPort).address}`);

  // Report the agent info to the discovery server.
  // No need to await this, since we don't care whether it succeeds or fails.
  // noinspection ES6MissingAwait
  reportAgentDiscovery(serverPort);
  setInterval(
    () => reportAgentDiscovery(serverPort),
    DISCOVERY_REPORT_TIME * 1000
  );
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

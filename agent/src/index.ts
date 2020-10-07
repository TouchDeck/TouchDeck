import 'reflect-metadata';
import express from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { getAvailableActions } from './actions/actionRegistry';
import { DISCOVERY_REPORT_TIME, HTTP_PORT, IMAGES_DIR } from './constants';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
import { agentInfo } from './api/getAgentInfo';
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
  log.info(`Agent running on ${agentInfo.address}`);

  // Start the websocket server.
  const server = new WebSocketServer();
  server.registerHandler('get-info', () => agentInfo);
  server.registerHandler('get-configuration', getConfiguration);
  server.registerHandler('set-configuration', updateConfig);
  server.registerHandler('upsert-configuration-button', upsertButton);
  server.registerHandler('delete-configuration-button', deleteButton);
  server.registerHandler('set-layout', updateLayout);
  server.registerHandler('get-action-options', getActionOptions);
  server.registerHandler('press-button', pressButton);

  // Report the agent info to the discovery server.
  // No need to await this, since we don't care whether it succeeds or fails.
  // noinspection ES6MissingAwait
  reportAgentDiscovery();
  setInterval(() => reportAgentDiscovery(), DISCOVERY_REPORT_TIME * 1000);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

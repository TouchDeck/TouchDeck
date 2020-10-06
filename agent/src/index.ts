import 'reflect-metadata';
import express from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import invokeAction from './api/invokeAction';
import { getAvailableActions } from './actions/actionRegistry';
import { DISCOVERY_REPORT_TIME, IMAGES_DIR, PORT } from './constants';
import { readConfiguration, setConfiguration } from './configuration/config';
import getActionOptions from './api/getActionOptions';
import {
  deleteButton,
  getConfig,
  putButton,
  putConfig,
  putLayout,
} from './api/config';
import getAgentInfo, { agentInfo } from './api/getAgentInfo';
import reportAgentDiscovery from './util/reportAgentDiscovery';
import cors from './util/cors';
import getButtonStates from './api/getButtonStates';

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
  app.get('/api', getAgentInfo);
  app.post('/api/actions/:action', invokeAction);
  app.get('/api/actions/options', getActionOptions);
  app.get('/api/actions/states', getButtonStates);
  app.get('/api/config', getConfig);
  app.put('/api/config', putConfig);
  app.put('/api/config/buttons', putButton);
  app.put('/api/config/buttons/:button', putButton);
  app.delete('/api/config/buttons/:button', deleteButton);
  app.put('/api/config/layouts/:layout', putLayout);

  // Done!
  app.listen(PORT);
  log.info(`Agent running on ${agentInfo.address}`);

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

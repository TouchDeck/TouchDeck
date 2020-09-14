import 'reflect-metadata';
import express from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import invokeAction from './api/invokeAction';
import { getAvailableActions } from './actions/actionRegistry';
import { DISCOVERY_REPORT_TIME, PORT } from './constants';
import { loadConfiguration, saveConfiguration } from './configuration/config';
import getActionOptions from './api/getActionOptions';
import { getConfig, putConfig } from './api/config';
import getAgentInfo, { agentInfo } from './api/getAgentInfo';
import reportAgentDiscovery from './util/reportAgentDiscovery';
import cors from './util/cors';

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

  // Load and re-save the configuration to ensure proper formatting.
  await loadConfiguration();
  await saveConfiguration();

  // Start express.
  log.debug('Setting up routes');
  const app = express();
  app.use(express.json());
  app.use(cors);

  // API routes.
  app.get('/api', getAgentInfo);
  app.post('/api/actions/:action', invokeAction);
  app.get('/api/actions/options', getActionOptions);
  app.get('/api/config', getConfig);
  app.put('/api/config', putConfig);

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
  log.error(err);
});

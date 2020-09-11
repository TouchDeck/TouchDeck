import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import Logger from './Logger';
import invokeAction from './api/invokeAction';
import { getAvailableActions } from './actions/actionRegistry';
import { DISCOVERY_SERVER, PORT } from './constants';
import { loadConfiguration, saveConfiguration } from './configuration/config';
import getActionOptions from './api/getActionOptions';
import { getConfig, putConfig } from './api/config';
import getAgentInfo, { agentInfo } from './api/getAgentInfo';

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
  app.use(cors());

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
  await fetch(`${DISCOVERY_SERVER}/api/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentInfo),
  })
    .then(() => log.debug('Agent reported to discovery server'))
    .catch((err) =>
      log.error(`Failed to report agent to discovery server: ${err.message}`)
    );
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err);
});

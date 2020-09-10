import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import Logger from './Logger';
import invokeAction from './api/invokeAction';
import { getAvailableActions } from './actions/actionRegistry';
import { PORT } from './constants';
import { loadConfiguration, saveConfiguration } from './configuration/config';
import getActionOptions from './api/getActionOptions';
import { getConfig, putConfig } from './api/config';
import getLocalAddress from './getLocalAddress';

const log = new Logger('index');
log.debug('Starting server...');

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
  app.post('/api/actions/:action', invokeAction);
  app.get('/api/actions/options', getActionOptions);
  app.get('/api/config', getConfig);
  app.put('/api/config', putConfig);

  // Done!
  app.listen(PORT);

  // Get the local IP address, report it to the discovery server.
  // TODO
  log.info(`Agent running on ${getLocalAddress()}:${PORT}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err);
});

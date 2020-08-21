import 'reflect-metadata';
import express from 'express';
import Logger from './Logger';
import invokeAction from './api/invokeAction';
import { getActions } from './actions/actionRegistry';
import { PORT } from './constants';
import { loadConfiguration, saveConfiguration } from './configuration/config';

const log = new Logger('index');
log.debug('Starting server...');

async function bootstrap(): Promise<void> {
  // Load and log all the action classes.
  const availableActionClasses = getActions();
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
  app.post('/api/actions', invokeAction);

  // Done!
  app.listen(PORT);
  log.info(`Server started on port ${PORT}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err);
});

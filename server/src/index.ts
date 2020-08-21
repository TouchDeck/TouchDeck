import 'reflect-metadata';
import express from 'express';
import Logger from './Logger';
import invokeAction from './api/invokeAction';
import { loadConfiguration } from './Configuration';
import { getActions } from './actions/actionRegistry';

const log = new Logger('index');
log.debug('Starting server...');

const availableActionClasses = getActions();
log.debug(`Found ${availableActionClasses.length} action classes:`);
availableActionClasses.forEach((action) =>
  log.debug(
    `  - ${action.category}/${action.name} (${action.constructor.name})`
  )
);

loadConfiguration();

log.debug('Setting up routes');
const app = express();
app.use(express.json());
app.post('/api/actions', invokeAction);

app.listen(4000);
log.debug('Server started');

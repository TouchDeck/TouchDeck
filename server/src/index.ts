import express from 'express';
import Logger from './Logger';
import invokeAction from './api/invokeAction';
import { loadConfiguration } from './Configuration';

const log = new Logger('index');
log.debug('Starting server...');

loadConfiguration();

log.debug('Setting up routes');
const app = express();
app.use(express.json());
app.post('/api/actions', invokeAction);

app.listen(4000);
log.debug('Server started');

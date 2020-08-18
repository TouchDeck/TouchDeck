import express from 'express';
import Logger from './Logger';
import invokeAction from './api/invokeAction';

const log = new Logger('index');
log.info('Starting server...');

const app = express();
app.post('/api/actions', invokeAction);

app.listen(4000);

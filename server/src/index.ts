import express from 'express';
import Logger from './Logger';

const log = new Logger('index');
log.info('Starting server...');

const app = express();
app.post('/api/actions', (req, res) => {
  res.send({ ok: true });
});

app.listen(4000);

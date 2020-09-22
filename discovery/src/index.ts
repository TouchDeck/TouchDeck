import express from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { PORT } from './constants';
import { getAgents, registerAgent } from './agents';
import cors from './cors';

const log = new Logger('index');
log.debug('Starting discovery server...');

async function bootstrap(): Promise<void> {
  // Start express.
  const app = express();
  app.use(express.json());
  app.use(cors);

  // API routes.
  app.get('/api/agents', getAgents);
  app.post('/api/agents', registerAgent);

  // Done!
  app.listen(PORT);
  log.info(`Discovery server running on port ${PORT}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

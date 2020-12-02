import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { getAvailableActions } from './actions/actionRegistry';
import { DISCOVERY_REPORT_TIME, PORT } from './constants';
import {
  getConfiguration,
  readConfiguration,
  setConfiguration,
} from './configuration/config';
import reportAgentDiscovery from './util/reportAgentDiscovery';
import WebSocketServer from './WebSocketServer';
import getActionOptions from './wsApi/getActionOptions';
import {
  deleteButton,
  updateConfig,
  updateLayout,
  upsertButton,
} from './wsApi/config';
import pressButton from './wsApi/pressButton';
import getAgentInfo from './util/getAgentInfo';
import getImages from './wsApi/getImages';
import sendButtonStates from './wsApi/sendButtonStates';
import { setServerInstance } from './serverInstance';

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

  // Start the websocket server.
  log.debug('Starting websocket server');
  const server = new WebSocketServer({ port: PORT, path: '/ws' });
  setServerInstance(server);
  const serverPort = server.address().port;

  // Register all websocket server handlers.
  server.registerHandler('get-info', () => getAgentInfo(serverPort));
  server.registerHandler('get-configuration', getConfiguration);
  server.registerHandler('set-configuration', updateConfig);
  server.registerHandler('upsert-configuration-button', upsertButton);
  server.registerHandler('delete-configuration-button', deleteButton);
  server.registerHandler('set-layout', updateLayout);
  server.registerHandler('get-action-options', getActionOptions);
  server.registerHandler('get-images', getImages);
  server.registerHandler('press-button', pressButton(server));

  // When a new connection is established, send all button states.
  // TODO: Make this not a broadcast, but only send to the newly connected client.
  server.server.addListener('connection', () => sendButtonStates(server));

  log.info(`Agent running on ${getAgentInfo(serverPort).address}`);

  // Report the agent info to the discovery server.
  // No need to await this, since we don't care whether it succeeds or fails.
  // noinspection ES6MissingAwait
  reportAgentDiscovery(serverPort);
  setInterval(
    () => reportAgentDiscovery(serverPort),
    DISCOVERY_REPORT_TIME * 1000
  );
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

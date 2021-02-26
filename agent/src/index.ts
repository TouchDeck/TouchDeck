import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import {
  CONFIG_DIR,
  IMAGES_DIR,
  SCRIPTS_DIR,
  TEMPLATES_DIR,
  TEMPLATES_OUTPUT_DIR,
} from './constants';
import { Injector } from './Injector';
import { ConfigManager } from './ConfigManager';
import { Agent } from './Agent';
import { getAgentMeta } from './util/getAgentMeta';
import { TemplateManager } from './actions/template/TemplateManager';
import { assertDirExists } from './util/assertDirExists';

const log = new Logger('index');
log.debug('Starting agent...');

async function bootstrap(): Promise<void> {
  const injector = new Injector();

  // Assert that all required directories exist.
  await assertDirExists(CONFIG_DIR);
  await Promise.all(
    [IMAGES_DIR, TEMPLATES_DIR, TEMPLATES_OUTPUT_DIR, SCRIPTS_DIR].map(
      assertDirExists
    )
  );

  // Load the configuration.
  const configManager = injector.getInstance(ConfigManager);
  await configManager.load();

  // Load the templates.
  const templateManager = injector.getInstance(TemplateManager);
  await templateManager.load();

  // Inject the agent, and we're off!
  injector.getInstance(Agent);
  log.info(`Agent running on ${getAgentMeta().address}`);
}

bootstrap().catch((err) => {
  log.error('An unexpected error occurred:');
  log.error(err.stack);
});

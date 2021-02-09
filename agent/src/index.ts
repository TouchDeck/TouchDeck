import 'reflect-metadata';
import { Logger } from '@luca_scorpion/tinylogger';
import { promises as fs } from 'fs';
import { CONFIG_DIR, IMAGES_DIR, TEMPLATES_DIR } from './constants';
import { Injector } from './Injector';
import { ConfigManager } from './ConfigManager';
import { Agent } from './Agent';
import { getAgentMeta } from './util/getAgentMeta';
import { TemplateManager } from './actions/template/TemplateManager';

const log = new Logger('index');
log.debug('Starting agent...');

async function bootstrap(): Promise<void> {
  const injector = new Injector();

  // Assert that all required directories exist.
  await fs.stat(CONFIG_DIR).catch(() => fs.mkdir(CONFIG_DIR));
  await fs.stat(IMAGES_DIR).catch(() => fs.mkdir(IMAGES_DIR));
  await fs.stat(TEMPLATES_DIR).catch(() => fs.mkdir(TEMPLATES_DIR));

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

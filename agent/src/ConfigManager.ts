import { Configuration } from 'touchdeck-model';
import { promises as fs } from 'fs';
import { Logger } from '@luca_scorpion/tinylogger';
import { CONFIG_FILE } from './constants';
import validateConfig from './validateConfig';
import { singleton } from './Injector';
import { ActionRegistry } from './actions/ActionRegistry';

@singleton
export class ConfigManager {
  private static readonly log = new Logger(ConfigManager.name);

  private configuration?: Configuration;

  public constructor(private readonly actionRegistry: ActionRegistry) {}

  /**
   * Get the current configuration.
   * If this is called before {@link load} is called, an error is thrown.
   */
  public get config(): Configuration {
    if (!this.configuration) {
      throw new Error('Configuration is not loaded');
    }

    return this.configuration;
  }

  /**
   * Load the configuration from disk.
   * This also validates the loaded configuration,
   * and writes it back to disk to ensure proper file formatting.
   */
  public async load(): Promise<void> {
    ConfigManager.log.debug('Loading configuration from disk');

    // Assert that the config file exists.
    await fs.stat(CONFIG_FILE).catch(() => fs.writeFile(CONFIG_FILE, '{}'));

    // Read the config file.
    const configJson = (
      await fs.readFile(CONFIG_FILE, { encoding: 'utf-8' })
    ).toString();

    // Parse and validate the configuration.
    const loadedConfig = validateConfig(JSON.parse(configJson));

    // Save the configuration to prepare the actions.
    // This also writes it back to disk to ensure proper formatting.
    await this.setConfiguration(loadedConfig);
  }

  /**
   * Update the configuration.
   * This stores it and writes it back to disk.
   *
   * @param newConfig The new configuration.
   */
  public async setConfiguration(newConfig: Configuration): Promise<void> {
    ConfigManager.log.debug('Updating configuration');

    this.configuration = validateConfig(newConfig);

    // Prepare the new actions.
    this.actionRegistry.prepareActions(this.config.buttons);

    await this.save();
  }

  /**
   * Save the current configuration to disk.
   */
  private async save(): Promise<void> {
    ConfigManager.log.debug('Writing configuration to disk');
    await fs.writeFile(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }
}

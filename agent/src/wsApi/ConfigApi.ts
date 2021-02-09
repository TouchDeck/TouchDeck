import { ButtonConfig, ButtonLayout, Configuration } from 'touchdeck-model';
import { ConfigManager } from '../ConfigManager';
import { singleton } from '../Injector';

@singleton
export class ConfigApi {
  public constructor(private readonly manager: ConfigManager) {
    this.updateConfig = this.updateConfig.bind(this);
    this.upsertButton = this.upsertButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
  }

  public async updateConfig(newConfig: Configuration): Promise<Configuration> {
    await this.manager.setConfiguration(newConfig);
    return this.manager.config;
  }

  public async upsertButton(newButton: ButtonConfig): Promise<Configuration> {
    const newConfig = { ...this.manager.config };
    newConfig.buttons = [
      ...newConfig.buttons.filter((b) => b.id !== newButton.id),
      newButton,
    ];
    await this.manager.setConfiguration(newConfig);
    return this.manager.config;
  }

  public async deleteButton(buttonId: string): Promise<Configuration> {
    const newConfig = { ...this.manager.config };
    newConfig.buttons = newConfig.buttons.filter((b) => b.id !== buttonId);
    await this.manager.setConfiguration(newConfig);
    return this.manager.config;
  }

  public async updateLayout(newLayout: ButtonLayout): Promise<Configuration> {
    const newConfig = { ...this.manager.config };
    newConfig.layouts = [
      ...newConfig.layouts.filter((l) => l.id !== newLayout.id),
      newLayout,
    ];
    await this.manager.setConfiguration(newConfig);
    return this.manager.config;
  }
}

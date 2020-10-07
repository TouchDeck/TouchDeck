import Configuration, {
  ButtonLayout,
} from '../model/configuration/Configuration';
import { getConfiguration, setConfiguration } from '../configuration/config';
import { ButtonConfig } from '../model/configuration/ButtonConfig';

export async function updateConfig(
  newConfig: Configuration
): Promise<Configuration> {
  await setConfiguration(newConfig);
  return getConfiguration();
}

export async function upsertButton(
  newButton: ButtonConfig
): Promise<Configuration> {
  const newConfig = { ...getConfiguration() };
  newConfig.buttons = [
    ...newConfig.buttons.filter((b) => b.id !== newButton.id),
    newButton,
  ];
  await setConfiguration(newConfig);
  return getConfiguration();
}

export async function deleteButton(buttonId: string): Promise<Configuration> {
  const newConfig = { ...getConfiguration() };
  newConfig.buttons = newConfig.buttons.filter((b) => b.id !== buttonId);
  await setConfiguration(newConfig);
  return getConfiguration();
}

export async function updateLayout(
  newLayout: ButtonLayout
): Promise<Configuration> {
  const newConfig = { ...getConfiguration() };
  newConfig.layouts = [
    ...newConfig.layouts.filter((l) => l.id !== newLayout.id),
    newLayout,
  ];
  await setConfiguration(newConfig);
  return getConfiguration();
}

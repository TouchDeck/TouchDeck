import Configuration from '../model/configuration/Configuration';
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

export async function updateLayout(): Promise<Configuration> {
  const newConfig = { ...getConfiguration() };
  // TODO
  // newConfig.layouts[req.params.layout] = req.body;
  await setConfiguration(newConfig);
  return getConfiguration();
}

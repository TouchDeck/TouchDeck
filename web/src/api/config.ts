import { ButtonConfig } from './buttons';

export interface Configuration {
  buttons: ButtonConfig[];
}

export async function getConfiguration(): Promise<Configuration> {
  return (await fetch('/api/config')).json();
}

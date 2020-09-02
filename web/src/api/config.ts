import { ButtonConfig } from './buttons';

export interface Configuration {
  buttons: ButtonConfig[];
  targets: {
    obs: ObsTargetConfig;
  };
}

export interface ObsTargetConfig {
  ip: string;
  port: number;
  authenticated: boolean;
  password: string;
}

export async function getConfiguration(): Promise<Configuration> {
  return (await fetch('/api/config')).json();
}

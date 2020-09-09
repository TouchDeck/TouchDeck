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

import { ButtonConfig } from './ButtonConfig';
import { TargetConfig } from './TargetConfig';

export interface Configuration {
  version: string;
  targets: TargetConfig;
  buttons: ButtonConfig[];
  layouts: ButtonLayout[];
  defaultProfile: string;
  profiles: Profile[];
}

export interface ButtonLayout {
  id: string;
  layout: (string | null)[];
}

export interface Profile {
  id: string;
  name: string;
  rootLayout: string;
}

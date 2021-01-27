import { ButtonConfig } from './ButtonConfig';
import { TargetConfig } from './TargetConfig';

export interface Configuration {
  targets: TargetConfig;
  buttons: ButtonConfig[];
  layouts: ButtonLayout[];
}

export type ButtonLayout = {
  id: string;
  layout: (string | null)[];
};

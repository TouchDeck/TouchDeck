import { ButtonConfig } from './ButtonConfig';
import TargetConfig from './TargetConfig';

export default interface Configuration {
  targets: TargetConfig;
  buttons: ButtonConfig[];
  layouts: ButtonLayouts;
}

export interface ButtonLayouts {
  root: ButtonLayout;
  [id: string]: ButtonLayout;
}

export type ButtonLayout = (string | null)[];

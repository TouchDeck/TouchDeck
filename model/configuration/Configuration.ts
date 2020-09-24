import { ButtonConfig } from './ButtonConfig';
import TargetConfig from './TargetConfig';

export default interface Configuration {
  targets: TargetConfig;
  buttons: ButtonConfig[];
  layouts: ButtonLayouts;
}

export interface ButtonLayouts {
  root: string[];
  [id: string]: string[];
}

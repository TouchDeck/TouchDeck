import { ButtonConfig } from './ButtonConfig';
import TargetConfig from './TargetConfig';

export default interface Configuration {
  buttons: ButtonConfig[];
  targets: TargetConfig;
}

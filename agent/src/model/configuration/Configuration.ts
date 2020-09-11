import ObsTargetConfig from './ObsTargetConfig';
import { ButtonConfig } from './ButtonConfig';

export default interface Configuration {
  buttons: ButtonConfig[];
  targets: {
    obs: ObsTargetConfig;
  };
}

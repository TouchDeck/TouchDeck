import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import Configuration from '../model/configuration/Configuration';
import {
  ButtonConfig,
  ButtonStyling,
  ToggleButtonState,
} from '../model/configuration/ButtonConfig';
import ActionConfig from '../model/configuration/ActionConfig';
import TargetConfig, {
  ObsTargetConfig,
} from '../model/configuration/TargetConfig';

const colorRegex = /^#[\da-f]{6}$/i;

function validateOrGetUuid(uuid?: string): string {
  return !uuid || !validateUuid(uuid) ? uuidv4() : uuid;
}

function validateAction(action?: ActionConfig): ActionConfig {
  return {
    id: validateOrGetUuid(action?.id),
    type: action?.type || '',
    args: action?.args || {},
  };
}

function validateColorOrDefault(
  color: string | undefined,
  defaultColor: string
): string {
  if (!color) {
    return defaultColor;
  }
  if (!color.match(colorRegex)) {
    throw new Error(`Invalid color: ${color}`);
  }
  return color;
}

function validateButtonStyle(style?: ButtonStyling): ButtonStyling {
  return {
    text: style?.text || '',
    image: style?.image || '',
    textColor: validateColorOrDefault(style?.textColor, '#000000'),
    backgroundColor: validateColorOrDefault(style?.backgroundColor, '#ffffff'),
  };
}

function validateToggleButtonState(
  state?: ToggleButtonState
): ToggleButtonState {
  return {
    style: validateButtonStyle(state?.style),
    action: validateAction(state?.action),
  };
}

function validateButton(button: ButtonConfig): ButtonConfig {
  switch (button.type) {
    case 'normal':
      return {
        name: button.name,
        type: button.type,
        action: validateAction(button.action),
        style: validateButtonStyle(button.style),
      };
    case 'folder':
      return {
        name: button.name,
        type: button.type,
        buttons: (button.buttons || []).map(validateButton),
        style: validateButtonStyle(button.style),
      };
    case 'toggle':
      return {
        name: button.name,
        type: button.type,
        state1: validateToggleButtonState(button.state1),
        state2: validateToggleButtonState(button.state2),
      };
    default:
      throw new Error(`Invalid button type "${button.type}"`);
  }
}

function validateObsTarget(obs?: ObsTargetConfig): ObsTargetConfig {
  return {
    ip: obs?.ip || 'localhost',
    port: obs?.port ?? 4444,
    authenticated: obs?.authenticated ?? false,
    password: obs?.password || '',
  };
}

function validateTargets(targets?: TargetConfig): TargetConfig {
  return {
    obs: validateObsTarget(targets?.obs),
  };
}

export default function validateConfig(config: Configuration): Configuration {
  return {
    targets: validateTargets(config.targets),
    buttons: (config.buttons || []).map(validateButton),
  };
}

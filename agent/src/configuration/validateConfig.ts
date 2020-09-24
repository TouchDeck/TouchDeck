import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import Configuration, {
  ButtonLayouts,
} from '../model/configuration/Configuration';
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

function validateAction(action?: Partial<ActionConfig>): ActionConfig {
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

function validateButtonStyle(style?: Partial<ButtonStyling>): ButtonStyling {
  return {
    text: style?.text || '',
    image: style?.image || '',
    textColor: validateColorOrDefault(style?.textColor, '#000000'),
    backgroundColor: validateColorOrDefault(style?.backgroundColor, '#ffffff'),
  };
}

function validateToggleButtonState(
  state?: Partial<ToggleButtonState>
): ToggleButtonState {
  return {
    style: validateButtonStyle(state?.style),
    action: validateAction(state?.action),
  };
}

function validateButton(button: Partial<ButtonConfig>): ButtonConfig {
  switch (button.type) {
    case 'normal':
      return {
        id: validateOrGetUuid(button.id),
        name: button.name || '',
        type: button.type,
        action: validateAction(button.action),
        style: validateButtonStyle(button.style),
      };
    case 'folder':
      return {
        id: validateOrGetUuid(button.id),
        name: button.name || '',
        type: button.type,
        style: validateButtonStyle(button.style),
      };
    case 'toggle':
      return {
        id: validateOrGetUuid(button.id),
        name: button.name || '',
        type: button.type,
        state1: validateToggleButtonState(button.state1),
        state2: validateToggleButtonState(button.state2),
      };
    default:
      throw new Error(`Invalid button type "${button.type}"`);
  }
}

function validateObsTarget(obs?: Partial<ObsTargetConfig>): ObsTargetConfig {
  return {
    ip: obs?.ip || 'localhost',
    port: obs?.port ?? 4444,
    authenticated: obs?.authenticated ?? false,
    password: obs?.password || '',
  };
}

function validateTargets(targets?: Partial<TargetConfig>): TargetConfig {
  return {
    obs: validateObsTarget(targets?.obs),
  };
}

function validateLayout(layout: (string | null)[]): (string | null)[] {
  const validated = [...layout];

  // Remove any trailing nulls.
  for (let i = validated.length - 1; i >= 0; i--) {
    if (!validated[i]) {
      validated.splice(i, 1);
    } else {
      break;
    }
  }

  return validated;
}

function validateLayouts(layouts?: Partial<ButtonLayouts>): ButtonLayouts {
  const validated: ButtonLayouts = { root: [], ...layouts };
  Object.keys(validated).forEach((key) => {
    validated[key] = validateLayout(validated[key]);
  });
  return validated;
}

export default function validateConfig(
  config: Partial<Configuration>
): Configuration {
  return {
    targets: validateTargets(config.targets),
    buttons: (config.buttons || []).map(validateButton),
    layouts: validateLayouts(config.layouts || {}),
  };
}

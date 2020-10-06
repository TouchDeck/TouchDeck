import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import Configuration, {
  ButtonLayout,
  ButtonLayouts,
} from '../model/configuration/Configuration';
import {
  ButtonConfig,
  ButtonStyling,
} from '../model/configuration/ButtonConfig';
import ActionConfig from '../model/configuration/ActionConfig';
import TargetConfig, {
  ObsTargetConfig,
} from '../model/configuration/TargetConfig';
import NoopAction from '../actions/NoopAction';

const colorRegex = /^#[\da-f]{6}$/i;

type ButtonMap = { [id: string]: ButtonConfig };

function validateOrGetUuid(uuid?: string): string {
  return !uuid || !validateUuid(uuid) ? uuidv4() : uuid;
}

function validateAction(action?: Partial<ActionConfig>): ActionConfig {
  return {
    type: action?.type || NoopAction.name,
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
        action: validateAction(button.action),
        trueStyle: validateButtonStyle(button.trueStyle),
        falseStyle: validateButtonStyle(button.falseStyle),
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

function validateLayout(
  layout: ButtonLayout,
  buttons: ButtonMap
): ButtonLayout {
  // Replace all buttons that don't exist in the button map with null.
  const validated = layout.map((b) => (b && buttons[b] ? b : null));

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

function validateLayouts(
  layouts: Partial<ButtonLayouts> | undefined,
  buttons: ButtonMap
): ButtonLayouts {
  const validated: ButtonLayouts = { root: layouts?.root || [] };

  // Ensure that all layouts correspond to a folder button.
  const layoutsToCheck = layouts || {};
  Object.entries(layoutsToCheck).forEach(([id, layout]) => {
    const button = buttons[id];
    if (button && button.type === 'folder') {
      validated[id] = layout || [];
    }
  });

  // Ensure that all folder buttons have a layout.
  Object.values(buttons).forEach((button) => {
    if (button.type === 'folder' && !validated[button.id]) {
      validated[button.id] = [];
    }
  });

  // Validate all the layouts.
  Object.keys(validated).forEach((key) => {
    validated[key] = validateLayout(validated[key], buttons);
  });
  return validated;
}

export default function validateConfig(
  config: Partial<Configuration>
): Configuration {
  const validButtons = (config.buttons || []).map(validateButton);
  const buttonMap: ButtonMap = {};
  validButtons.forEach((b) => {
    buttonMap[b.id] = b;
  });

  return {
    targets: validateTargets(config.targets),
    buttons: validButtons,
    layouts: validateLayouts(config.layouts || {}, buttonMap),
  };
}

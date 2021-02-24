import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import {
  Configuration,
  ActionConfig,
  TargetConfig,
  ButtonConfig,
  ButtonLayout,
  ButtonStyling,
  ObsTargetConfig,
  Profile,
} from 'touchdeck-model';
import { NoopAction } from './actions/NoopAction';

const currentVersion = '1';

const colorRegex = /^#[\da-f]{6}$/i;

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
        layout: validateOrGetUuid(button.layout),
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
  buttons: ButtonConfig[]
): ButtonLayout {
  const buttonIds = new Set<string>(buttons.map((button) => button.id));

  // Replace all buttons that don't exist with null.
  const validatedLayout = layout.layout.map((b) =>
    b && buttonIds.has(b) ? b : null
  );

  // Remove any trailing nulls.
  for (let i = validatedLayout.length - 1; i >= 0; i--) {
    if (!validatedLayout[i]) {
      validatedLayout.splice(i, 1);
    } else {
      break;
    }
  }

  return {
    id: layout.id,
    layout: validatedLayout,
  };
}

function validateLayouts(
  layouts: ButtonLayout[],
  buttons: ButtonConfig[]
): ButtonLayout[] {
  const layoutIds = new Set<string>(layouts.map((layout) => layout.id));
  const result = [...layouts];

  // Ensure that all folder buttons have a layout.
  buttons.forEach((button) => {
    if (button.type === 'folder' && !layoutIds.has(button.layout)) {
      result.push({ id: button.layout, layout: [] });
    }
  });

  // Validate all the layouts.
  return result.map((layout) => validateLayout(layout, buttons));
}

function validateProfile(profile: Profile): Profile {
  return {
    id: validateOrGetUuid(profile.id),
    name: profile.name,
    rootLayout: validateOrGetUuid(profile.rootLayout),
  };
}

function validateProfiles(
  profiles: Profile[],
  defaultProfile: string,
  layouts: ButtonLayout[]
): Profile[] {
  const profileIds = new Set<string>();

  // Validate all profiles.
  const validated = profiles.map((profile) => {
    profileIds.add(profile.id);
    return validateProfile(profile);
  });

  // Ensure that there is a default profile.
  if (!profileIds.has(defaultProfile)) {
    const defaultLayout: ButtonLayout = {
      id: uuidv4(),
      layout: [],
    };
    layouts.push(defaultLayout);

    validated.push({
      id: defaultProfile,
      name: 'Default',
      rootLayout: defaultLayout.id,
    });
  }

  return validated;
}

function validateLayoutIds(
  layouts: ButtonLayout[],
  buttons: ButtonConfig[],
  profiles: Profile[]
): ButtonLayout[] {
  const validLayoutsIds = new Set<string>();

  // Ensure that all layouts correspond to a folder button or profile.
  buttons.forEach((button) => {
    if (button.type === 'folder') {
      validLayoutsIds.add(button.layout);
    }
  });
  profiles.forEach((profile) => validLayoutsIds.add(profile.rootLayout));

  return layouts.filter((layout) => validLayoutsIds.has(layout.id));
}

export default function validateConfig(
  config: Partial<Configuration>
): Configuration {
  if (config.version && config.version !== currentVersion) {
    throw new Error(`Unsupported configuration version: ${config.version}`);
  }

  const validButtons = (config.buttons || []).map(validateButton);
  const layouts = validateLayouts(config.layouts || [], validButtons);
  const defaultProfile = validateOrGetUuid(config.defaultProfile);
  const validProfiles = validateProfiles(
    config.profiles || [],
    defaultProfile,
    layouts
  );

  return {
    version: config.version || currentVersion,
    targets: validateTargets(config.targets),
    buttons: validButtons,
    layouts: validateLayoutIds(layouts, validButtons, validProfiles),
    defaultProfile,
    profiles: validProfiles,
  };
}

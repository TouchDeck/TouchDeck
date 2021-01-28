import {
  ActionConfig,
  ButtonConfig,
  ButtonStyling,
  ButtonType,
} from 'touchdeck-model';

export default function newButton(
  type: ButtonType,
  from?: ButtonConfig
): ButtonConfig {
  switch (type) {
    case 'normal':
      return {
        type,
        id: from?.id || '',
        name: from?.name || '',
        action: {
          ...getDefaultAction(),
          ...(from && 'action' in from && from.action),
        },
        style: {
          ...getDefaultStyle(),
          ...(from && 'style' in from && from.style),
        },
      };
    case 'toggle':
      return {
        type,
        id: from?.id || '',
        name: from?.name || '',
        action: {
          ...getDefaultAction(),
          ...(from && 'action' in from && from.action),
        },
        trueStyle: {
          ...getDefaultStyle(),
          ...(from && 'trueStyle' in from && from.trueStyle),
        },
        falseStyle: {
          ...getDefaultStyle(),
          ...(from && 'falseStyle' in from && from.falseStyle),
        },
      };
    case 'folder':
      return {
        type,
        id: from?.id || '',
        name: from?.name || '',
        style: {
          ...getDefaultStyle(),
          ...(from && 'style' in from && from.style),
        },
        layout: '',
      };
    default:
      throw new Error(`Unknown button type: ${type}`);
  }
}

function getDefaultStyle(): ButtonStyling {
  return {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    text: '',
    image: '',
  };
}

function getDefaultAction(): ActionConfig {
  return {
    type: 'NoopAction',
    args: {},
  };
}

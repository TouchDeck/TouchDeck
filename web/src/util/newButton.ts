import {
  ButtonConfig,
  ButtonStyling,
  ButtonType,
} from '../model/configuration/ButtonConfig';
import ActionConfig from '../model/configuration/ActionConfig';

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
        state1: {
          action: {
            ...getDefaultAction(),
            ...(from && 'state1' in from && from.state1.action),
          },
          style: {
            ...getDefaultStyle(),
            ...(from && 'state1' in from && from.state1.style),
          },
        },
        state2: {
          action: {
            ...getDefaultAction(),
            ...(from && 'state2' in from && from.state2.action),
          },
          style: {
            ...getDefaultStyle(),
            ...(from && 'state2' in from && from.state2.style),
          },
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
    id: '',
    type: 'NoopAction',
    args: {},
  };
}

import { Agent } from '../api/Agent';
import { Reducer } from 'react';
import {
  ActionOption,
  AgentMeta,
  ButtonStates,
  Configuration,
  ImageInfo,
  TemplateInfo,
} from 'touchdeck-model';

export interface ConnectedAgentState {
  connecting: false;
  agent: Agent;
  info: AgentMeta;
  config: Configuration;
  actionOptions: ActionOption[];
  buttonStates: ButtonStates;
  images: ImageInfo[];
  templates: TemplateInfo[];
  activeProfileId: string;
  scripts: string[];
}

export type State =
  | {
      connecting: boolean;
      agent: undefined;
      info: undefined;
      config?: Configuration;
      actionOptions: undefined;
      buttonStates: {};
      images: ImageInfo[];
      templates: TemplateInfo[];
      activeProfileId: undefined;
      scripts: string[];
    }
  | ConnectedAgentState;

export type Action =
  | {
      type: 'agentConnecting';
    }
  | {
      type: 'agentConnected';
      agent: Agent;
      info: AgentMeta;
      config: Configuration;
      actionOptions: ActionOption[];
      images: ImageInfo[];
      templates: TemplateInfo[];
      scripts: string[];
    }
  | {
      type: 'agentDisconnected';
    }
  | {
      type: 'configLoading';
    }
  | {
      type: 'configLoaded';
      config: Configuration;
    }
  | {
      type: 'buttonStateChanged';
      buttonId: string;
      buttonState: boolean;
    }
  | {
      type: 'imagesLoaded';
      images: ImageInfo[];
    }
  | {
      type: 'templatesLoaded';
      templates: TemplateInfo[];
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'agentConnecting':
      return {
        ...prevState,
        connecting: true,
        agent: undefined,
        info: undefined,
        config: undefined,
        actionOptions: undefined,
        buttonStates: {},
        images: [],
        templates: [],
        activeProfileId: undefined,
        scripts: [],
      };
    case 'agentConnected':
      return {
        ...prevState,
        connecting: false,
        agent: action.agent,
        info: action.info,
        config: action.config,
        actionOptions: action.actionOptions,
        images: action.images,
        templates: action.templates,
        activeProfileId: action.config.defaultProfile,
        scripts: action.scripts,
        // Don't overwrite the button states here,
        // this event might occur after first button state changed messages.
      };
    case 'agentDisconnected':
      return {
        ...prevState,
        connecting: false,
        agent: undefined,
        info: undefined,
        config: undefined,
        actionOptions: undefined,
        buttonStates: {},
        images: [],
        templates: [],
        activeProfileId: undefined,
        scripts: [],
      };
    case 'configLoaded':
      return { ...prevState, config: action.config };
    case 'buttonStateChanged':
      return {
        ...prevState,
        buttonStates: {
          ...prevState.buttonStates,
          [action.buttonId]: action.buttonState,
        },
      };
    case 'imagesLoaded':
      return { ...prevState, images: action.images };
    case 'templatesLoaded':
      return { ...prevState, templates: action.templates };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  connecting: false,
  agent: undefined,
  info: undefined,
  config: undefined,
  actionOptions: undefined,
  buttonStates: {},
  images: [],
  templates: [],
  activeProfileId: undefined,
  scripts: [],
});

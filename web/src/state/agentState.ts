import Agent from '../api/Agent';
import { Reducer } from 'react';
import {
  ActionOption,
  AgentMeta,
  ButtonStates,
  Configuration,
  ImageInfo,
} from 'touchdeck-model';

export interface ConnectedAgentState {
  connecting: false;
  agent: Agent;
  info: AgentMeta;
  config: Configuration;
  actionOptions: ActionOption[];
  buttonStates: ButtonStates;
  images: ImageInfo[];
  activeProfileId: string;
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
      activeProfileId: undefined;
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
        activeProfileId: undefined,
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
        activeProfileId: action.config.defaultProfile,
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
        activeProfileId: undefined,
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
  activeProfileId: undefined,
});

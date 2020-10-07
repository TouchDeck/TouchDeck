import Agent from '../api/Agent';
import { Reducer } from 'react';
import AgentInfo from '../model/AgentInfo';
import ActionOption from '../model/ActionOption';
import Configuration from '../model/configuration/Configuration';
import { ButtonStates } from '../model/ButtonStates';

export interface ConnectedAgentState {
  connecting: false;
  agent: Agent;
  info: AgentInfo;
  config: Configuration;
  actionOptions: ActionOption[];
  buttonStates: ButtonStates;
}

export type State =
  | {
      connecting: boolean;
      agent: undefined;
      info: undefined;
      config?: Configuration;
      actionOptions: undefined;
      buttonStates: ButtonStates;
    }
  | ConnectedAgentState;

export type Action =
  | {
      type: 'agentConnecting';
    }
  | {
      type: 'agentConnected';
      agent: Agent;
      info: AgentInfo;
      config: Configuration;
      actionOptions: ActionOption[];
      buttonStates: ButtonStates;
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
      };
    case 'agentConnected':
      return {
        ...prevState,
        connecting: false,
        agent: action.agent,
        info: action.info,
        config: action.config,
        actionOptions: action.actionOptions,
        buttonStates: action.buttonStates,
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
});

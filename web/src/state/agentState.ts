import Agent from '../api/Agent';
import { Reducer } from 'react';
import AgentInfo from '../model/AgentInfo';
import ActionOption from '../model/ActionOption';

export type State =
  | {
      connecting: boolean;
      agent: undefined;
      info: undefined;
      actionOptions: undefined;
    }
  | {
      connecting: false;
      agent: Agent;
      info: AgentInfo;
      actionOptions: ActionOption[];
    };

export type Action =
  | {
      type: 'agentConnecting';
    }
  | {
      type: 'agentConnected';
      agent: Agent;
      info: AgentInfo;
      actionOptions: ActionOption[];
    }
  | {
      type: 'agentDisconnected';
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'agentConnecting':
      return {
        ...prevState,
        connecting: true,
        agent: undefined,
        info: undefined,
        actionOptions: undefined,
      };
    case 'agentConnected':
      return {
        ...prevState,
        connecting: false,
        agent: action.agent,
        info: action.info,
        actionOptions: action.actionOptions,
      };
    case 'agentDisconnected':
      return {
        ...prevState,
        connecting: false,
        agent: undefined,
        info: undefined,
        actionOptions: undefined,
      };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  connecting: false,
  agent: undefined,
  info: undefined,
  actionOptions: undefined,
});

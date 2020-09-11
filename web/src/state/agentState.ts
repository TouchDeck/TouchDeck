import Agent from '../api/Agent';
import { Reducer } from 'react';
import AgentInfo from '../model/AgentInfo';

export type State =
  | {
      connecting: boolean;
      agent: undefined;
      info: undefined;
    }
  | {
      connecting: false;
      agent: Agent;
      info: AgentInfo;
    };

export type Action =
  | {
      type: 'agentConnecting';
    }
  | {
      type: 'agentConnected';
      agent: Agent;
      info: AgentInfo;
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
      };
    case 'agentConnected':
      return {
        ...prevState,
        connecting: false,
        agent: action.agent,
        info: action.info,
      };
    case 'agentDisconnected':
      return {
        ...prevState,
        connecting: false,
        agent: undefined,
        info: undefined,
      };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  connecting: false,
  agent: undefined,
  info: undefined,
});

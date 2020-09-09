import Agent from '../api/Agent';
import { Reducer } from 'react';

export type State =
  | {
      connecting: boolean;
      agent: undefined;
    }
  | {
      connecting: false;
      agent: Agent;
    };

export type Action =
  | {
      type: 'agentConnecting';
    }
  | {
      type: 'agentConnected';
      agent: Agent;
    }
  | {
      type: 'agentDisconnected';
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'agentConnecting':
      return { ...prevState, connecting: true, agent: undefined };
    case 'agentConnected':
      return { ...prevState, connecting: false, agent: action.agent };
    case 'agentDisconnected':
      return { ...prevState, connecting: false, agent: undefined };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  connecting: false,
  agent: undefined,
});

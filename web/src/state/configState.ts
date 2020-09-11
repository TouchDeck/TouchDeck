import { Reducer } from 'react';
import Configuration from '../model/configuration/Configuration';

export type State =
  | {
      loading: boolean;
      config: undefined;
    }
  | {
      loading: false;
      config: Configuration;
    };

export type Action =
  | {
      type: 'configLoading';
    }
  | {
      type: 'configLoaded';
      config: Configuration;
    }
  | {
      type: 'agentDisconnected';
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'configLoading':
      return { ...prevState, loading: true, config: undefined };
    case 'configLoaded':
      return { ...prevState, loading: false, config: action.config };
    case 'agentDisconnected':
      return { ...prevState, loading: false, config: undefined };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  loading: false,
  config: undefined,
});

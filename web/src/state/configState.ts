import { Reducer } from 'react';
import { Configuration } from '../api/config';

export type State =
  | {
      loading: true;
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
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'configLoading':
      return { ...prevState, loading: true, config: undefined };
    case 'configLoaded':
      return { ...prevState, loading: false, config: action.config };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  loading: true,
});

import React, { Dispatch, Reducer, useContext, useReducer } from 'react';
import {
  Action as ConfigAction,
  getInitialState as getInitialConfigState,
  reducer as configReducer,
  State as ConfigState,
} from './configState';

export interface State {
  config: ConfigState;
}

export type Action = ConfigAction;

const reducer: Reducer<State, Action> = (prevState, action) => {
  return {
    config: configReducer(prevState.config, action),
  };
};

const getInitialState = (): State => ({
  config: getInitialConfigState(),
});

export const AppContext = React.createContext<[State, Dispatch<Action>]>([
  getInitialState(),
  () => undefined,
]);

export const AppContextProvider: React.FC = ({ children }) => {
  const value = useReducer(reducer, null, getInitialState);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalState = () => useContext(AppContext);

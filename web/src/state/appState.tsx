import React, { Dispatch, Reducer, useContext, useReducer } from 'react';
import {
  Action as ConfigAction,
  getInitialState as getInitialConfigState,
  reducer as configReducer,
  State as ConfigState,
} from './configState';
import {
  Action as AgentAction,
  getInitialState as getInitialAgentState,
  reducer as agentReducer,
  State as AgentState,
} from './agentState';

export interface State {
  config: ConfigState;
  agent: AgentState;
}

export type Action = ConfigAction | AgentAction;

const reducer: Reducer<State, Action> = (prevState, action) => {
  return {
    config: configReducer(prevState.config, action as ConfigAction),
    agent: agentReducer(prevState.agent, action as AgentAction),
  };
};

const getInitialState = (): State => ({
  config: getInitialConfigState(),
  agent: getInitialAgentState(),
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

export const useAgent = () => useGlobalState()[0].agent.agent!;

export const useConfig = () => useGlobalState()[0].config.config!;

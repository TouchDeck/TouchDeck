import React, { Dispatch, Reducer, useContext, useReducer } from 'react';
import {
  Action as AgentAction,
  ConnectedAgentState,
  getInitialState as getInitialAgentState,
  reducer as agentReducer,
  State as AgentState,
} from './agentState';

export interface State {
  agent: AgentState;
}

export type Action = AgentAction;

const reducer: Reducer<State, Action> = (prevState, action) => {
  return {
    agent: agentReducer(prevState.agent, action),
  };
};

const getInitialState = (): State => ({
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

export const useConnectedAgent = () =>
  useGlobalState()[0].agent as ConnectedAgentState;

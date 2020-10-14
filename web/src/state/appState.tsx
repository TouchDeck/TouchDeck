import React, { Dispatch, Reducer, useContext, useReducer } from 'react';
import {
  Action as AgentAction,
  ConnectedAgentState,
  getInitialState as getInitialAgentState,
  reducer as agentReducer,
  State as AgentState,
} from './agentState';
import {
  Action as MessagesAction,
  getInitialState as getInitialMessagesState,
  reducer as messagesReducer,
  State as MessagesState,
} from './messagesState';

export interface State {
  agent: AgentState;
  messages: MessagesState;
}

export type Action = AgentAction | MessagesAction;

const reducer: Reducer<State, Action> = (prevState, action) => {
  return {
    agent: agentReducer(prevState.agent, action as AgentAction),
    messages: messagesReducer(prevState.messages, action as MessagesAction),
  };
};

const getInitialState = (): State => ({
  agent: getInitialAgentState(),
  messages: getInitialMessagesState(),
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

export const useConnectedAgent = () => {
  const agent = useGlobalState()[0].agent;
  if (!agent.info) {
    throw new Error(
      'Trying to get connected agent state while not connected to agent.'
    );
  }
  return agent;
};

export const useMessages = () => useGlobalState()[0].messages.messages;

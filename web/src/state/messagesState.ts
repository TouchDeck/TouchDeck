import { Reducer } from 'react';

export interface State {
  messages: string[];
}

export type Action =
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'dismissError';
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'error':
      return {
        ...prevState,
        messages: [...prevState.messages, action.message],
      };
    case 'dismissError':
      return {
        ...prevState,
        messages: prevState.messages.slice(1),
      };
    default:
      return prevState;
  }
};

export const getInitialState = (): State => ({
  messages: [],
});

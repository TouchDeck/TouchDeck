import { Reducer } from 'react';

export interface Message {
  message: string;
  id: string;
}

export interface State {
  messages: Message[];
}

export type Action =
  | {
      type: 'error';
      message: string;
      id: string;
    }
  | {
      type: 'dismissError';
    };

export const reducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case 'error':
      return {
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            message: action.message,
            id: action.id,
          },
        ],
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

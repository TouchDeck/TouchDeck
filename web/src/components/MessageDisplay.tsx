import React, { useEffect } from 'react';
import { useGlobalState, useMessages } from '../state/appState';
import { classNames } from '../util/classNames';

export const MessageDisplay: React.FC = ({ children }) => {
  const [, dispatch] = useGlobalState();
  const [message] = useMessages();

  const messageId = message?.id;
  useEffect(() => {
    if (message) {
      // Automatically clear the message.
      setTimeout(() => dispatch({ type: 'dismissError' }), 10000);
    }
  }, [message, messageId, dispatch]);

  return (
    <>
      {children}
      <div className={classNames(['message', message && 'visible'])}>
        {message?.message}
      </div>
    </>
  );
};

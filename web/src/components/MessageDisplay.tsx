import React, { useEffect } from 'react';
import { useGlobalState, useMessages } from '../state/appState';

const MessageDisplay: React.FC = ({ children }) => {
  const [, dispatch] = useGlobalState();
  const [message] = useMessages();

  const messageId = message?.id;
  useEffect(() => {
    if (message) {
      // Clear the message after 5 seconds.
      setTimeout(() => {
        console.log('clearing message');
        dispatch({ type: 'dismissError' });
      }, 5000);
    }
  }, [message, messageId, dispatch]);

  return (
    <>
      {children}
      {message && <div className="message">{message.message}</div>}
    </>
  );
};

export default MessageDisplay;

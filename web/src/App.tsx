import React from 'react';
import DeckPage from './pages/DeckPage';
import { useGlobalState } from './state/appState';
import ConnectAgentPage from './pages/ConnectAgentPage';

const App: React.FC = () => {
  const [{ agent }] = useGlobalState();

  // If we are not connected to an agent, show the connect page.
  if (!agent.agent || agent.connecting) {
    return <ConnectAgentPage />;
  }

  // We are connected, launch the deck!
  return <DeckPage />;
};

export default App;

import React from 'react';
import DeckPage from './pages/DeckPage';
import { useGlobalState } from './state/appState';
import ConnectAgentPage from './pages/ConnectAgentPage';
import { Route, Switch } from 'react-router-dom';
import AgentInfoPage from './pages/AgentInfoPage';
import Layout from './components/Layout';
import TargetsSettingsPage from './pages/TargetsSettingsPage';

const App: React.FC = () => {
  const [{ agent }] = useGlobalState();

  // If we are not connected to an agent, show the connect page.
  if (!agent.agent || agent.connecting) {
    return <ConnectAgentPage />;
  }

  // We are connected, launch the deck!
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={DeckPage} />
        <Route exact path="/layout">
          <DeckPage editing />
        </Route>
        <Route exact path="/targets" component={TargetsSettingsPage} />
        <Route exact path="/agent" component={AgentInfoPage} />
      </Switch>
    </Layout>
  );
};

export default App;

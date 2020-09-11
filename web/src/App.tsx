import React, { useEffect } from 'react';
import DeckPage from './pages/DeckPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useGlobalState } from './state/appState';
import ButtonsSettingsPage from './pages/ButtonsSettingsPage';
import TargetsSettingsPage from './pages/TargetsSettingsPage';
import ConnectAgentPage from './pages/ConnectAgentPage';

const App: React.FC = () => {
  const [{ agent }, dispatch] = useGlobalState();

  useEffect(() => {
    if (!agent.agent) {
      return;
    }

    // Load the configuration from the agent, store it in global state.
    agent.agent.getConfiguration().then((config) => {
      dispatch({
        type: 'configLoading',
      });
      dispatch({
        type: 'configLoaded',
        config,
      });
    });
  }, [dispatch, agent]);

  // If we are not connected to an agent, show the connect page.
  if (!agent.agent || agent.connecting) {
    return <ConnectAgentPage />;
  }

  // We are connected, launch the deck!
  return (
    <Switch>
      <Route exact path="/" component={DeckPage} />
      <Redirect exact path="/settings" to="/settings/buttons" />
      <Route exact path="/settings/buttons" component={ButtonsSettingsPage} />
      <Route exact path="/settings/targets" component={TargetsSettingsPage} />
      <Redirect to="/" />
    </Switch>
  );
};

export default App;

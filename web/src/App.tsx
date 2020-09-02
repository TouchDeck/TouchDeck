import React, { useEffect } from 'react';
import DeckPage from './pages/DeckPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useGlobalState } from './state/appState';
import { getConfiguration } from './api/config';
import ButtonsSettingsPage from './pages/ButtonsSettingsPage';
import TargetsSettingsPage from './pages/TargetsSettingsPage';

const App: React.FC = () => {
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    getConfiguration().then((config) => {
      dispatch({
        type: 'configLoading',
      });
      dispatch({
        type: 'configLoaded',
        config,
      });
    });
  }, [dispatch]);

  return (
    <>
      <Switch>
        <Route exact path="/" component={DeckPage} />
        <Redirect exact path="/settings" to="/settings/buttons" />
        <Route exact path="/settings/buttons" component={ButtonsSettingsPage} />
        <Route exact path="/settings/targets" component={TargetsSettingsPage} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;

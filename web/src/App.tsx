import React, { useEffect } from 'react';
import DeckPage from './pages/DeckPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import { useGlobalState } from './state/appState';
import { getConfiguration } from './api/config';

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
        <Route exact path="/settings" component={SettingsPage} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;

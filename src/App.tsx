import React from 'react';
import DeckPage from './pages/DeckPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
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

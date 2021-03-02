import React from 'react';
import {
  ConnectAgentPage,
  DeckPage,
  ImagesPage,
  ProfilesPage,
  TargetsPage,
  TemplatesPage,
} from './pages';
import { useGlobalState } from './state/appState';
import { Route, Switch } from 'react-router-dom';
import { AgentInfoModal } from './components/AgentInfoModal';
import { Layout } from './components/Layout';
import { MessageDisplay } from './components/MessageDisplay';

export const App: React.FC = () => {
  const [{ agent }] = useGlobalState();

  // If we are not connected to an agent, show the connect page.
  if (!agent.agent || agent.connecting) {
    return (
      <MessageDisplay>
        <ConnectAgentPage />
      </MessageDisplay>
    );
  }

  // We are connected, launch the deck!
  return (
    <MessageDisplay>
      <Layout>
        <Switch>
          <Route exact path="/" component={DeckPage} />
          <Route exact path="/buttons">
            <DeckPage editing />
          </Route>
          <Route exact path="/images" component={ImagesPage} />
          <Route exact path="/templates" component={TemplatesPage} />
          <Route exact path="/profiles" component={ProfilesPage} />
          <Route exact path="/targets" component={TargetsPage} />
        </Switch>
      </Layout>
      <AgentInfoModal />
    </MessageDisplay>
  );
};

import React, { useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import Menu from '../components/Menu';
import Icon from '../components/Icon';
import { Route, Switch, useLocation } from 'react-router-dom';
import AgentInfoPanel from '../components/AgentInfoPanel';

const DeckPage: React.FC = () => {
  const location = useLocation();
  // If the pathname is longer than 1 ('/'), default the menu to open.
  const [showMenu, setShowMenu] = useState(location.pathname.length > 1);

  return (
    <div className="deck">
      {!showMenu && (
        <Icon
          className="open-menu"
          icon="bars"
          size={2}
          onClick={() => setShowMenu(true)}
        />
      )}
      <Menu open={showMenu} onClose={() => setShowMenu(false)} />

      <Switch>
        <Route exact path="/">
          <ButtonGrid rowCount={3} columnCount={5} />
        </Route>
        <Route exact path="/layout">
          <ButtonGrid rowCount={3} columnCount={5} editing />
        </Route>
        <Route exact path="/agent" component={AgentInfoPanel} />
      </Switch>
    </div>
  );
};

export default DeckPage;

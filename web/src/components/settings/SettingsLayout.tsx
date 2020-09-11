import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const SettingsLayout: React.FC = ({ children }) => (
  <div className="settings-layout">
    <nav>
      <Link to="/">
        <h2>Back to Deck</h2>
      </Link>
      <NavLink to="/settings/buttons">
        <h2>Buttons</h2>
      </NavLink>
      <NavLink to="/settings/targets">
        <h2>Targets</h2>
      </NavLink>
      <NavLink to="/settings/agent">
        <h2>Agent</h2>
      </NavLink>
    </nav>
    <div className="content">{children}</div>
  </div>
);

export default SettingsLayout;

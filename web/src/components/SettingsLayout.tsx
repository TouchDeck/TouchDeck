import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useGlobalState } from '../state/appState';

const SettingsLayout: React.FC = ({ children }) => {
  const [, dispatch] = useGlobalState();

  return (
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
        <Link
          to="/"
          onClick={() =>
            dispatch({
              type: 'agentDisconnected',
            })
          }
        >
          <h2>Disconnect</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default SettingsLayout;

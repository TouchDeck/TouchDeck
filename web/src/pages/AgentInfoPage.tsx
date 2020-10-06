import React from 'react';
import Rows from '../components/Rows';
import capitalizeFirstLetter from '../util/capitalizeFirstLetter';
import { Link } from 'react-router-dom';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import Button from '../components/Button';

const AgentInfoPage: React.FC = () => {
  const [, dispatch] = useGlobalState();
  const { info } = useConnectedAgent();

  return (
    <main className="agent-info">
      <h3>Connected agent:</h3>
      <Rows>
        <div>
          <span>Address:</span>
          <span>{info.address}</span>
        </div>
        <div>
          <span>Version:</span>
          <span>{info.version}</span>
        </div>
        <div>
          <span>Platform:</span>
          <span>{capitalizeFirstLetter(info.platform)}</span>
        </div>
        <div>
          <span>Hostname:</span>
          <span>{info.hostname}</span>
        </div>
      </Rows>
      <Link
        className="disconnect"
        to="/"
        onClick={() => dispatch({ type: 'agentDisconnected' })}
      >
        <Button negative icon="power-off">
          Disconnect
        </Button>
      </Link>
    </main>
  );
};

export default AgentInfoPage;

import React from 'react';
import Rows from './Rows';
import capitalizeFirstLetter from '../util/capitalizeFirstLetter';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import Button from './Button';
import Modal from './Modal';

export const AgentInfoModal: React.FC = () => {
  const [, dispatch] = useGlobalState();
  const { info } = useConnectedAgent();
  const location = useLocation();
  const active = location.hash === '#agent';
  const history = useHistory();

  return (
    <Modal
      className="agent-info"
      active={active}
      onClose={() => history.push('#')}
    >
      <h3>Connected agent:</h3>
      <Rows compact>
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
      <div className="disconnect">
        <Link to="/" onClick={() => dispatch({ type: 'agentDisconnected' })}>
          <Button negative icon="power-off">
            Disconnect
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

import React from 'react';
import { capitalizeFirstLetter } from '../util/capitalizeFirstLetter';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { Button } from './Button';
import { Modal } from './Modal';
import { Columns } from './Columns';

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
      <Columns compact>
        <div>
          <span>Address:</span>
          <span>Version:</span>
          <span>Platform:</span>
          <span>Hostname:</span>
        </div>
        <div>
          <span>{info.address}</span>
          <span>{info.version}</span>
          <span>{capitalizeFirstLetter(info.platform)}</span>
          <span>{info.hostname}</span>
        </div>
      </Columns>
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

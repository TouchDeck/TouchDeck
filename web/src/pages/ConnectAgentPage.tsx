import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../state/appState';
import Icon from '../components/Icon';
import Agent from '../api/Agent';

const ConnectAgentPage: React.FC = () => {
  const [, dispatch] = useGlobalState();

  const [connectInput, setConnectInput] = useState('');
  const [agentsList, setAgentsList] = useState<string[]>();

  useEffect(() => {
    // Load the agents from the server.
    // TODO
    setAgentsList(['http://localhost:3000', '127.0.0.1', '192.168.0.10']);
  }, []);

  const connectToAgent = useCallback(
    (address) => {
      dispatch({
        type: 'agentConnecting',
      });
      const agent = new Agent(address);
      // TODO: test if agent is valid.
      dispatch({
        type: 'agentConnected',
        agent,
      });
    },
    [dispatch]
  );

  return (
    <div className="connect-agent">
      <main>
        <h2>Connect to an agent</h2>

        <h3>Select an agent from the list (todo):</h3>
        <div className="agents-list">
          {!agentsList && <Icon icon="spinner" size={3} pulse />}
          {agentsList &&
            agentsList.map((agent) => (
              <div key={agent} onClick={() => connectToAgent(agent)}>
                <Icon icon="windows" iconStyle="brands" size={2} /> {agent}
              </div>
            ))}
        </div>

        <h3>Or enter the IP address:</h3>
        <input
          placeholder="localhost:3000"
          value={connectInput}
          onChange={(e) => setConnectInput(e.currentTarget.value)}
        />
        <button
          disabled={!connectInput}
          onClick={() => connectToAgent(connectInput)}
        >
          Connect
        </button>
      </main>
    </div>
  );
};

export default ConnectAgentPage;

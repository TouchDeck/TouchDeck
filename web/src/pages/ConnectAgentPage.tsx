import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../state/appState';
import Icon from '../components/Icon';
import Agent from '../api/Agent';
import { AgentInfo, listAgents } from '../api/agents';
import sanitizeAddress from '../util/sanitizeAddress';

const ConnectAgentPage: React.FC = () => {
  const [, dispatch] = useGlobalState();

  const [connectInput, setConnectInput] = useState('');
  const [agentsList, setAgentsList] = useState<AgentInfo[]>();

  useEffect(() => {
    listAgents()
      .then(setAgentsList)
      .catch((err) => {
        console.error('Could not list agents:', err);
        setAgentsList([]);
      });
  }, []);

  const connectToAgent = useCallback(
    (address) => {
      const sanitizedAddress = sanitizeAddress(address);
      // Connect to the agent.
      dispatch({
        type: 'agentConnecting',
      });
      const agent = new Agent(sanitizedAddress);

      // Test if the agent is valid.
      agent
        .getInfo()
        .then((info) => {
          if (info.name !== 'pideck-server') {
            throw new Error(`unknown agent name '${info.name}'`);
          }

          dispatch({
            type: 'agentConnected',
            agent,
          });
        })
        .catch((err) => {
          console.error('Invalid agent:', err.message);
          dispatch({
            type: 'agentDisconnected',
          });
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
              <div
                key={agent.localAddress}
                onClick={() => connectToAgent(agent.localAddress)}
              >
                <Icon icon={agent.os} iconStyle="brands" size={2} />{' '}
                {agent.localAddress}
              </div>
            ))}
        </div>

        <h3>Or enter the IP address:</h3>
        <div className="manual-address">
          <input
            placeholder="localhost:3000"
            value={connectInput}
            onChange={(e) => setConnectInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (connectInput && e.key === 'Enter') {
                connectToAgent(connectInput);
              }
            }}
          />
          <button
            disabled={!connectInput}
            onClick={() => connectToAgent(connectInput)}
          >
            Connect
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConnectAgentPage;

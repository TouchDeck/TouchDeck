import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../state/appState';
import Icon from '../components/Icon';
import Agent from '../api/Agent';
import listDiscoveredAgents from '../api/listDiscoveredAgents';
import sanitizeAddress from '../util/sanitizeAddress';
import Dimmer from '../components/Dimmer';
import DiscoveredAgent from '../model/DiscoveredAgent';

const ConnectAgentPage: React.FC = () => {
  const [{ agent, config }, dispatch] = useGlobalState();

  const [connectInput, setConnectInput] = useState('');
  const [agentsList, setAgentsList] = useState<DiscoveredAgent[]>();

  useEffect(() => {
    listDiscoveredAgents()
      .then(setAgentsList)
      .catch((err) => {
        console.error('Could not list agents:', err);
        setAgentsList([]);
      });
  }, []);

  const connectToAgent = useCallback(
    async (address) => {
      const sanitizedAddress = sanitizeAddress(address);
      // Connect to the agent.
      dispatch({ type: 'agentConnecting' });
      const newAgent = new Agent(sanitizedAddress);

      // Test if the agent is valid.
      try {
        const info = await newAgent.getInfo();
        if (info.name !== 'pideck-agent') {
          console.error('Invalid agent name:', info.name);
          dispatch({ type: 'agentDisconnected' });
          return;
        }
      } catch (err) {
        console.error('Could not ping agent:', err.message);
        dispatch({ type: 'agentDisconnected' });
        return;
      }

      // Load the configuration from the agent.
      dispatch({ type: 'configLoading' });
      const agentConfig = await newAgent.getConfiguration();

      // Dispatch the loaded and connected events.
      dispatch({ type: 'configLoaded', config: agentConfig });
      dispatch({
        type: 'agentConnected',
        agent: newAgent,
      });
    },
    [dispatch]
  );

  return (
    <div className="connect-agent">
      <Dimmer active={agent.connecting || config.loading}>
        <div>
          <Icon icon="spinner" size={3} pulse />
          <h2>Connecting to agent...</h2>
        </div>
      </Dimmer>
      <main>
        <h2>Connect to an agent</h2>

        <h3>Select an agent from the list:</h3>
        <div className="agents-list">
          {!agentsList && <Icon icon="spinner" size={3} pulse />}
          {agentsList &&
            agentsList.map((agentInfo) => (
              <div
                key={agentInfo.address}
                onClick={() => connectToAgent(agentInfo.address)}
              >
                <Icon icon={agentInfo.platform} iconStyle="brands" size={2} />{' '}
                {agentInfo.address}
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

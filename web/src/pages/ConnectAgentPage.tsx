import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../state/appState';
import Icon from '../components/Icon';
import Agent from '../api/Agent';
import listDiscoveredAgents from '../api/listDiscoveredAgents';
import sanitizeAddress from '../util/sanitizeAddress';
import Dimmer from '../components/Dimmer';
import AgentInfo from '../model/AgentInfo';
import AgentList from '../components/AgentList';

const ConnectAgentPage: React.FC = () => {
  const [{ agent }, dispatch] = useGlobalState();

  const [connectInput, setConnectInput] = useState('');
  const [agentList, setAgentList] = useState<AgentInfo[]>();
  const [agentListError, setAgentListError] = useState<string>();

  useEffect(() => {
    listDiscoveredAgents()
      .then(setAgentList)
      .catch((err) => setAgentListError(err.message));
  }, []);

  const connectToAgent = useCallback(
    async (address) => {
      const sanitizedAddress = sanitizeAddress(address);
      // Connect to the agent.
      dispatch({ type: 'agentConnecting' });
      const newAgent = new Agent(sanitizedAddress);

      // Test if the agent is valid.
      let agentInfo: AgentInfo;
      try {
        agentInfo = await newAgent.getInfo();
        if (agentInfo.name !== 'pideck-agent') {
          console.error('Invalid agent name:', agentInfo.name);
          dispatch({ type: 'agentDisconnected' });
          return;
        }
      } catch (err) {
        console.error('Could not ping agent:', err.message);
        dispatch({ type: 'agentDisconnected' });
        return;
      }

      // Load the configuration and action options from the agent.
      const agentConfig = await newAgent.getConfiguration();
      const actionOptions = await newAgent.getActionOptions();

      // Dispatch the connected event.
      dispatch({
        type: 'agentConnected',
        agent: newAgent,
        info: agentInfo,
        config: agentConfig,
        actionOptions,
      });
    },
    [dispatch]
  );

  return (
    <div className="connect-agent">
      <Dimmer active={agent.connecting}>
        <div>
          <Icon icon="spinner" size={3} pulse />
          <h2>Connecting to agent...</h2>
        </div>
      </Dimmer>
      <main>
        <h2>Connect to an agent</h2>

        <h3>Select an agent from the list:</h3>
        <AgentList
          agents={agentList}
          onClickAgent={(address) => connectToAgent(address)}
          error={agentListError}
        />

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

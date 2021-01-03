import React, { useCallback, useEffect, useState } from 'react';
import { useGlobalState } from '../state/appState';
import Icon from '../components/Icon';
import Agent from '../api/Agent';
import listDiscoveredAgents from '../api/listDiscoveredAgents';
import { AgentInfo, AgentMeta } from '../model/AgentInfo';
import { AgentList } from '../components/AgentList';
import TextInput from '../components/input/TextInput';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { errorId } from '../util/errorId';

export const ConnectAgentPage: React.FC = () => {
  const [{ agent }, dispatch] = useGlobalState();

  const [connectInput, setConnectInput] = useState('');
  const [agentList, setAgentList] = useState<AgentInfo[]>();
  const [agentListError, setAgentListError] = useState<string>();

  const refreshAgentList = useCallback(() => {
    setAgentList(undefined);
    listDiscoveredAgents()
      .then(setAgentList)
      .catch((err) => setAgentListError(err.message));
  }, []);

  useEffect(refreshAgentList, [refreshAgentList]);

  const connectToAgent = useCallback(
    async (id) => {
      // Connect to the agent.
      dispatch({ type: 'dismissError' });
      dispatch({ type: 'agentConnecting' });
      const newAgent = new Agent();

      try {
        await newAgent.connect(id);
      } catch {
        dispatch({ type: 'agentDisconnected' });
        dispatch({
          type: 'error',
          message: `Failed to connect to agent at ${id}`,
          id: errorId(),
        });
        return;
      }

      // Hook into the disconnect event.
      newAgent.onDisconnect(() => {
        dispatch({ type: 'agentDisconnected' });
      });

      // Hook into button state change events.
      newAgent.onButtonStateChanged((event) =>
        dispatch({
          type: 'buttonStateChanged',
          buttonId: event.buttonId,
          buttonState: event.buttonState,
        })
      );

      // Test if the agent is valid.
      let agentMeta: AgentMeta;
      try {
        agentMeta = await newAgent.getMeta();
        if (agentMeta.name !== 'touchdeck-agent') {
          dispatch({
            type: 'error',
            message: `Invalid agent name: ${agentMeta.name}`,
            id: errorId(),
          });
          dispatch({ type: 'agentDisconnected' });
          return;
        }
      } catch (err) {
        dispatch({
          type: 'error',
          message: `Could not connect to agent: ${err.message}`,
          id: errorId(),
        });
        dispatch({ type: 'agentDisconnected' });
        return;
      }

      // Load the configuration, action options from the agent.
      const agentConfig = await newAgent.getConfiguration();
      const actionOptions = await newAgent.getActionOptions();
      const images = await newAgent.getImages();

      // Dispatch the connected event.
      dispatch({
        type: 'agentConnected',
        agent: newAgent,
        info: agentMeta,
        config: agentConfig,
        actionOptions,
        images,
      });

      // TODO: Get button states message.
    },
    [dispatch]
  );

  return (
    <div className="connect-agent">
      <Modal active={agent.connecting}>
        <Icon icon="spinner" size={3} pulse />
        <h2>Connecting to agent...</h2>
      </Modal>

      <main>
        <h2>Connect to an agent</h2>

        <h3>
          Select an agent from the list:
          <Button icon="redo" compact onClick={refreshAgentList} />
        </h3>
        <AgentList
          agents={agentList}
          onClickAgent={(id) => connectToAgent(id)}
          error={agentListError}
        />

        <h3>Or enter the IP address:</h3>
        <div className="manual-address">
          <TextInput
            placeholder="localhost:3000"
            value={connectInput}
            onChange={setConnectInput}
            onKeyDown={(e) => {
              if (connectInput && e.key === 'Enter') {
                connectToAgent(connectInput);
              }
            }}
          />
          <Button
            disabled={!connectInput}
            onClick={() => connectToAgent(connectInput)}
            compact
          >
            Connect
          </Button>
        </div>
      </main>
    </div>
  );
};

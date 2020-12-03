import React from 'react';
import AgentInfo from '../model/AgentInfo';
import Icon from './Icon';

export interface Props {
  agents?: AgentInfo[];
  error?: string;
  onClickAgent: (address: string) => void;
}

const AgentList: React.FC<Props> = ({ agents, error, onClickAgent }) => (
  <div className="agent-list">
    {!agents && !error && <Icon icon="spinner" size={2} pulse />}
    {error && (
      <div className="error">
        Failed to list agents from discovery server: {error}
      </div>
    )}
    {agents && agents.length === 0 && (
      <div>No agents found on your local network.</div>
    )}
    {agents &&
      agents.map((agent) => (
        <div
          className="agent"
          key={agent.address}
          onClick={() => onClickAgent(agent.address)}
        >
          <Icon icon={agent.platform} iconStyle="brands" size={2} />{' '}
          <div className="details">
            <span className="hostname">{agent.hostname}</span>
            <span className="address">{agent.address}</span>
          </div>
        </div>
      ))}
  </div>
);

export default AgentList;

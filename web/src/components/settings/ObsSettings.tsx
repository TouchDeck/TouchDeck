import React, { useState } from 'react';
import { ObsTargetConfig } from '../../api/config';

export interface Props {
  config: ObsTargetConfig;
  onSaveConfig: (config: ObsTargetConfig) => void;
}

const ObsSettings: React.FC<Props> = ({ config, onSaveConfig }) => {
  const [newConfig, setNewConfig] = useState(config);

  return (
    <>
      <div>
        IP Address:
        <input
          placeholder="localhost"
          value={newConfig.ip}
          onChange={(e) => {
            const ip = e.currentTarget.value;
            setNewConfig((prev) => ({ ...prev, ip }));
          }}
        />
      </div>
      <div>
        Port:
        <input
          type="number"
          placeholder="4444"
          value={newConfig.port.toString()}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setNewConfig((prev) => ({ ...prev, port: parseInt(value, 10) }));
          }}
          min={0}
        />
      </div>
      <div>
        <input
          id="obs-authenticated"
          type="checkbox"
          onChange={(e) => {
            const authenticated = e.currentTarget.checked;
            // If the target is not authenticated, clear the password.
            if (!authenticated) {
              setNewConfig((prev) => ({ ...prev, password: '' }));
            }
            setNewConfig((prev) => ({ ...prev, authenticated }));
          }}
        />{' '}
        <label htmlFor="obs-authenticated">Authenticated</label>
      </div>
      <div>
        Password:
        <input
          type="password"
          disabled={!newConfig.authenticated}
          placeholder="p455w0rd"
          value={newConfig.password}
          onChange={(e) => {
            const password = e.currentTarget.value;
            setNewConfig((prev) => ({ ...prev, password }));
          }}
        />
      </div>
      <button onClick={() => onSaveConfig(newConfig)}>Save</button>
    </>
  );
};

export default ObsSettings;

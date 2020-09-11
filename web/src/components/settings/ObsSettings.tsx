import React, { useState } from 'react';
import ObsTargetConfig from '../../model/configuration/ObsTargetConfig';

export interface Props {
  config: ObsTargetConfig;
  onSaveConfig: (config: ObsTargetConfig) => void;
}

const ObsSettings: React.FC<Props> = ({ config, onSaveConfig }) => {
  const [newConfig, setNewConfig] = useState(config);

  return (
    <>
      <div className="inputs">
        <div>
          IP Address
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
          Port
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
          Authenticated
          <input
            type="checkbox"
            onChange={(e) => {
              const authenticated = e.currentTarget.checked;
              // If the target is not authenticated, clear the password.
              if (!authenticated) {
                setNewConfig((prev) => ({ ...prev, password: '' }));
              }
              setNewConfig((prev) => ({ ...prev, authenticated }));
            }}
          />
        </div>
        {newConfig.authenticated && (
          <div>
            Password
            <input
              type="password"
              placeholder="p455w0rd"
              value={newConfig.password}
              onChange={(e) => {
                const password = e.currentTarget.value;
                setNewConfig((prev) => ({ ...prev, password }));
              }}
            />
          </div>
        )}
      </div>
      <button onClick={() => onSaveConfig(newConfig)}>Save</button>
    </>
  );
};

export default ObsSettings;

import React, { useState } from 'react';
import ObsTargetConfig from '../../model/configuration/ObsTargetConfig';
import Rows from '../Rows';
import TextInput from '../input/TextInput';
import CheckboxInput from '../input/CheckboxInput';

export interface Props {
  config: ObsTargetConfig;
  onSaveConfig: (config: ObsTargetConfig) => void;
}

const ObsSettings: React.FC<Props> = ({ config, onSaveConfig }) => {
  const [newConfig, setNewConfig] = useState(config);

  return (
    <>
      <Rows>
        <div>
          <span>IP Address</span>
          <TextInput
            placeholder="localhost"
            value={newConfig.ip}
            onChange={(ip) => setNewConfig((prev) => ({ ...prev, ip }))}
          />
        </div>
        <div>
          <span>Port</span>
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
          <span>Authenticated</span>
          <CheckboxInput
            onChange={(authenticated) => {
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
            <span>Password</span>
            <TextInput
              type="password"
              placeholder="p455w0rd"
              value={newConfig.password}
              onChange={(password) =>
                setNewConfig((prev) => ({ ...prev, password }))
              }
            />
          </div>
        )}
      </Rows>
      <button onClick={() => onSaveConfig(newConfig)}>Save</button>
    </>
  );
};

export default ObsSettings;

import React, { useEffect, useState } from 'react';
import Rows from '../Rows';
import TextInput from '../input/TextInput';
import CheckboxInput from '../input/CheckboxInput';
import NumberInput from '../input/NumberInput';
import { useConnectedAgent } from '../../state/appState';
import { ObsTargetConfig } from '../../model/configuration/TargetConfig';

export interface Props {
  onSaveConfig: (config: ObsTargetConfig) => void;
}

const ObsSettings: React.FC<Props> = ({ onSaveConfig }) => {
  const { config } = useConnectedAgent();
  const [ip, setIp] = useState(config.targets.obs.ip);
  const [port, setPort] = useState(config.targets.obs.port);
  const [authenticated, setAuthenticated] = useState(
    config.targets.obs.authenticated
  );
  const [password, setPassword] = useState(config.targets.obs.password);

  useEffect(() => {
    setIp(config.targets.obs.ip);
    setPort(config.targets.obs.port);
    setAuthenticated(config.targets.obs.authenticated);
    setPassword(config.targets.obs.password);
  }, [config.targets.obs]);

  return (
    <>
      <Rows>
        <div>
          <span>IP Address</span>
          <TextInput placeholder="localhost" value={ip} onChange={setIp} />
        </div>
        <div>
          <span>Port</span>
          <NumberInput
            placeholder="4444"
            value={port}
            onChange={setPort}
            min={0}
          />
        </div>
        <div>
          <span>Authenticated</span>
          <CheckboxInput
            checked={authenticated}
            onChange={(newAuth) => {
              // If the target is not authenticated, clear the password.
              if (!newAuth) {
                setPassword('');
              }
              setAuthenticated(newAuth);
            }}
          />
        </div>
        {authenticated && (
          <div>
            <span>Password</span>
            <TextInput
              type="password"
              placeholder="p455w0rd"
              value={password}
              onChange={setPassword}
            />
          </div>
        )}
      </Rows>
      <button
        onClick={() => onSaveConfig({ ip, port, authenticated, password })}
      >
        Save
      </button>
    </>
  );
};

export default ObsSettings;

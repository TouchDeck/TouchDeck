import React, { useEffect, useState } from 'react';
import { TextInput } from '../input/TextInput';
import { CheckboxInput } from '../input/CheckboxInput';
import { NumberInput } from '../input/NumberInput';
import { useConnectedAgent } from '../../state/appState';
import { ObsTargetConfig } from 'touchdeck-model';
import { Button } from '../Button';
import { Columns } from '../Columns';
import { ButtonGroup } from '../ButtonGroup';

export interface Props {
  onSaveConfig: (config: ObsTargetConfig) => void;
  onClose: () => void;
}

export const ObsSettings: React.FC<Props> = ({ onSaveConfig, onClose }) => {
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
      <Columns>
        <div>
          <span>IP Address</span>
          <span>Port</span>
          <span>Authenticated</span>
          {authenticated && <span>Password</span>}
        </div>
        <div>
          <TextInput placeholder="localhost" value={ip} onChange={setIp} />
          <NumberInput
            placeholder="4444"
            value={port}
            onChange={setPort}
            min={0}
          />
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
          {authenticated && (
            <TextInput
              type="password"
              placeholder="p455w0rd"
              value={password}
              onChange={setPassword}
            />
          )}
        </div>
      </Columns>
      <div className="actions">
        <div />
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onSaveConfig({ ip, port, authenticated, password })}
            positive
            icon="save"
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

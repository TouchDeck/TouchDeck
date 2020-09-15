import React, { useCallback, useEffect, useState } from 'react';
import { NormalButtonConfig } from '../../model/configuration/ButtonConfig';
import Rows from '../Rows';
import ActionOptions from './ActionOptions';
import TextInput from '../input/TextInput';
import { useConnectedAgent } from '../../state/appState';
import { ActionParameter } from '../../model/ActionOption';
import CheckboxInput from '../input/CheckboxInput';
import capitalizeFirstLetter from '../../util/capitalizeFirstLetter';
import { ActionArgs } from '../../model/configuration/ActionConfig';
import ButtonStyleSettings from './ButtonStyleSettings';
import Button from '../buttons/Button';

export interface Props {
  button: NormalButtonConfig;
}

const NormalButtonSettings: React.FC<Props> = ({ button }) => {
  const { actionOptions } = useConnectedAgent();

  const [name, setName] = useState(button.name);
  const [style, setStyle] = useState(button.style);
  const [actionType, setActionType] = useState(button.action.type);
  const [actionArgs, setActionArgs] = useState<ActionArgs>(button.action.args);

  // The parameter info for the current action.
  const [actionParams, setActionParams] = useState<ActionParameter[]>(
    actionOptions.find((a) => a.id === actionType)?.parameters || []
  );

  useEffect(() => {
    setName(button.name);
    setStyle(button.style);
    setActionType(button.action.type);
    setActionArgs(button.action.args);
  }, [button]);

  useEffect(
    () =>
      setActionParams(
        actionOptions.find((a) => a.id === actionType)?.parameters || []
      ),
    [actionOptions, actionType]
  );

  const setActionArg = useCallback((paramName, newArg) => {
    setActionArgs((prevArgs) => ({ ...prevArgs, [paramName]: newArg }));
  }, []);

  return (
    <div>
      <div className="preview-row">
        <Rows>
          <div>
            <span>Name</span>
            <span>
              <TextInput value={name} onChange={setName} />
            </span>
          </div>
        </Rows>
        <div className="preview">
          <Button style={style} />
        </div>
      </div>

      <ButtonStyleSettings buttonStyle={style} onChange={setStyle} />

      <h3>Action</h3>
      <Rows>
        <div>
          <span>Type</span>
          <span>
            <ActionOptions
              actionType={actionType}
              onChange={(newAction) => setActionType(newAction)}
            />
          </span>
        </div>
        {actionParams.map((param) => (
          <div key={param.name}>
            <span>{capitalizeFirstLetter(param.name)}</span>
            <span>
              {param.type === 'string' && (
                <TextInput
                  value={actionArgs[param.name]?.toString()}
                  onChange={(arg) => setActionArg(param.name, arg)}
                />
              )}
              {param.type === 'boolean' && (
                <CheckboxInput
                  checked={Boolean(actionArgs[param.name])}
                  onChange={(arg) => setActionArg(param.name, arg)}
                />
              )}
            </span>
          </div>
        ))}
      </Rows>
    </div>
  );
};

export default NormalButtonSettings;

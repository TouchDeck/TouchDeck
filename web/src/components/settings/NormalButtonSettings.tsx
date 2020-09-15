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

export interface Props {
  button: NormalButtonConfig;
}

const NormalButtonSettings: React.FC<Props> = ({ button }) => {
  const { actionOptions } = useConnectedAgent();

  const [name, setName] = useState(button.name);
  const [text, setText] = useState(button.style.text);
  const [textColor, setTextColor] = useState(button.style.textColor);
  const [backgroundColor, setBackgroundColor] = useState(
    button.style.backgroundColor
  );
  const [actionType, setActionType] = useState(button.action.type);
  const [actionArgs, setActionArgs] = useState<ActionArgs>(button.action.args);

  // The parameter info for the current action.
  const [actionParams, setActionParams] = useState<ActionParameter[]>(
    actionOptions.find((a) => a.id === actionType)?.parameters || []
  );

  useEffect(() => {
    setName(button.name);
    setText(button.style.text);
    setTextColor(button.style.textColor);
    setBackgroundColor(button.style.backgroundColor);
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

  const setActionArg = useCallback((name, newArg) => {
    setActionArgs((prevArgs) => ({ ...prevArgs, [name]: newArg }));
  }, []);

  return (
    <div>
      <h3>Button</h3>
      <Rows>
        <div>
          <span>Name</span>
          <span>
            <TextInput value={name} onChange={setName} />
          </span>
        </div>
        <div>
          <span>Text</span>
          <span>
            <TextInput value={text} onChange={setText} />
          </span>
        </div>
        <div>
          <span>Text color</span>
          <span>
            <TextInput value={textColor} onChange={setTextColor} />
          </span>
        </div>
        <div>
          <span>Background color</span>
          <span>
            <TextInput value={backgroundColor} onChange={setBackgroundColor} />
          </span>
        </div>
      </Rows>

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

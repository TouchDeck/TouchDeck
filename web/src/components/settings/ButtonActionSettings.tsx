import React, { useCallback, useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter';
import { TextInput } from '../input/TextInput';
import { CheckboxInput } from '../input/CheckboxInput';
import {
  ActionConfig,
  ActionOption,
  ActionParameter,
  TemplateInfo,
} from 'touchdeck-model';
import { useConnectedAgent } from '../../state/appState';
import { FloatNumberInput } from '../input/FloatNumberInput';
import { DropdownInput } from '../input/DropdownInput';
import { removeExtension } from '../../util/removeExtension';
import { Columns } from '../Columns';

export interface Props {
  action: ActionConfig;
  onChange: (action: ActionConfig) => void;
}

export const ButtonActionSettings: React.FC<Props> = ({ action, onChange }) => {
  const { actionOptions, templates, scripts } = useConnectedAgent();

  // The currently selected action option.
  const [actionOption, setActionOption] = useState(
    actionOptions.find((option) => option.type === action.type)!
  );
  useEffect(
    () =>
      setActionOption(
        actionOptions.find((option) => option.type === action.type)!
      ),
    [actionOptions, action.type]
  );

  // The parameter info for the current action.
  const [actionParams, setActionParams] = useState<ActionParameter[]>(
    actionOption?.parameters || []
  );
  useEffect(() => setActionParams(actionOption?.parameters || []), [
    actionOptions,
    actionOption,
  ]);

  const setActionArg = useCallback(
    (paramName, arg) => {
      onChange({
        ...action,
        args: { ...action.args, [paramName]: arg },
      });
    },
    [action, onChange]
  );

  return (
    <Columns>
      <div>
        <span>Type</span>
        {actionParams
          .filter((param) => !!param)
          .map((param) => (
            <span key={param.name}>{capitalizeFirstLetter(param.name)}</span>
          ))}
      </div>
      <div>
        <DropdownInput<ActionOption>
          clearable={false}
          value={`${actionOption.category ? `${actionOption.category}: ` : ''}${
            actionOption.name
          }`}
          options={actionOptions}
          onChange={(a) => onChange({ ...action, type: a.type })}
          displayValue={(a) =>
            `${a.category ? `${a.category}: ` : ' '}${a.name}`
          }
        />
        {actionParams
          .filter((param) => !!param)
          .map((param) => (
            <div key={param.name}>
              {param.type === 'string' && (
                <TextInput
                  value={action.args[param.name]?.toString()}
                  onChange={(arg) => setActionArg(param.name, arg)}
                />
              )}
              {param.type === 'boolean' && (
                <CheckboxInput
                  checked={Boolean(action.args[param.name])}
                  onChange={(arg) => setActionArg(param.name, arg)}
                />
              )}
              {param.type === 'number' && (
                <FloatNumberInput
                  value={action.args[param.name]?.toString()}
                  onChange={(arg) => setActionArg(param.name, arg)}
                />
              )}
              {param.type === 'template' && (
                <DropdownInput<TemplateInfo>
                  clearable
                  value={removeExtension(action.args[param.name]?.toString())}
                  options={templates}
                  onChange={(t) => setActionArg(param.name, t?.path)}
                  displayValue={(t) => removeExtension(t.path)}
                />
              )}
              {param.type === 'script' && (
                <DropdownInput<string>
                  clearable
                  value={removeExtension(action.args[param.name]?.toString())}
                  options={scripts}
                  onChange={(s) => setActionArg(param.name, s)}
                  displayValue={removeExtension}
                />
              )}
            </div>
          ))}
      </div>
    </Columns>
  );
};

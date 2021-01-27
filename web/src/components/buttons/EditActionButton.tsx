import {
  ActionButtonConfig,
  ButtonConfig,
  NormalButtonConfig,
  ToggleButtonConfig,
} from 'touchdeck-model';
import React, { Dispatch, SetStateAction, useState } from 'react';
import ButtonActionSettings from '../settings/ButtonActionSettings';
import { useConnectedAgent } from '../../state/appState';
import { ButtonStyleSettings } from '../settings/ButtonStyleSettings';

export interface Props {
  button: ActionButtonConfig;
  setButton: Dispatch<SetStateAction<ButtonConfig>>;
}

export const EditActionButton: React.FC<Props> = ({ button, setButton }) => {
  const { actionOptions } = useConnectedAgent();

  const [actionOption, setActionOption] = useState(() =>
    actionOptions.find((o) => o.type === button.action.type)
  );

  const [trueStyleName, setTrueStyleName] = useState(() =>
    actionOption && actionOption.toggleable
      ? actionOption.toggleInfo.trueStateName
      : ''
  );
  const [falseStyleName, setFalseStyleName] = useState(() =>
    actionOption && actionOption.toggleable
      ? actionOption.toggleInfo.falseStateName
      : ''
  );

  return (
    <>
      <div>
        <h3>Action</h3>
        <ButtonActionSettings
          action={button.action}
          onChange={(action) => {
            // Find the new action option.
            const newActionOption = actionOptions.find(
              (o) => o.type === action.type
            )!;
            setActionOption(newActionOption);

            // Update the style names.
            if (newActionOption.toggleable) {
              setTrueStyleName(newActionOption.toggleInfo.trueStateName);
              setFalseStyleName(newActionOption.toggleInfo.falseStateName);
            }

            // Update the button configuration.
            setButton((prevState) => {
              // It's safe to cast this to ActionButtonConfig, since we have an 'action' prop.
              const newState = {
                ...prevState,
                action,
                type: newActionOption.toggleable ? 'toggle' : 'normal',
              } as ActionButtonConfig;

              // If the action changed between normal and toggleable, update the styles.
              if (prevState.type === 'normal' && newState.type === 'toggle') {
                newState.trueStyle = prevState.style;
                newState.falseStyle = prevState.style;
                // TODO
                delete ((newState as unknown) as NormalButtonConfig).style;
              }
              if (prevState.type === 'toggle' && newState.type === 'normal') {
                newState.style = prevState.trueStyle;
                // TODO
                delete ((newState as unknown) as ToggleButtonConfig).trueStyle;
                delete ((newState as unknown) as ToggleButtonConfig).falseStyle;
              }

              return newState;
            });
          }}
        />
      </div>
      {'style' in button && (
        <div>
          <h3>Style</h3>
          <ButtonStyleSettings
            buttonStyle={button.style}
            onChange={(style) =>
              setButton((prevState) => ({ ...prevState, style }))
            }
          />
        </div>
      )}
      {'trueStyle' in button && (
        <div>
          <h3>Style: {trueStyleName}</h3>
          <ButtonStyleSettings
            buttonStyle={button.trueStyle}
            onChange={(style) =>
              setButton((prevState) => ({
                ...prevState,
                trueStyle: style,
              }))
            }
          />
        </div>
      )}
      {'falseStyle' in button && (
        <div>
          <h3>Style: {falseStyleName}</h3>
          <ButtonStyleSettings
            buttonStyle={button.falseStyle}
            onChange={(style) =>
              setButton((prevState) => ({
                ...prevState,
                falseStyle: style,
              }))
            }
          />
        </div>
      )}
    </>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import ButtonStyleSettings from './ButtonStyleSettings';

export interface Props {
  button: NonNullable<ButtonConfig>;
}

const ButtonSettings: React.FC<Props> = ({ button }) => {
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [updates, setUpdates] = useState<ButtonConfig>({ ...button });

  const onSave = useCallback(async () => {
    dispatch({ type: 'configLoading' });
    const newConfig = await agent.setButton(button.id, updates);
    dispatch({ type: 'configLoaded', config: newConfig });
  }, [agent, button.id, dispatch, updates]);

  // Reset the updates whenever the button changes.
  useEffect(() => setUpdates(button), [button]);

  return (
    <div className="button-settings">
      {'style' in updates && (
        <ButtonStyleSettings
          buttonStyle={updates.style}
          onChange={(style) =>
            setUpdates((prevState) => ({ ...prevState, style }))
          }
        />
      )}
      {'state1' in updates && (
        <ButtonStyleSettings
          buttonStyle={updates.state1.style}
          onChange={(style) =>
            setUpdates((prevState) => ({
              ...prevState,
              state1: { ...updates.state1, style },
            }))
          }
        />
      )}
      {'state2' in updates && (
        <ButtonStyleSettings
          buttonStyle={updates.state2.style}
          onChange={(style) =>
            setUpdates((prevState) => ({
              ...prevState,
              state2: { ...updates.state2, style },
            }))
          }
        />
      )}
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default ButtonSettings;

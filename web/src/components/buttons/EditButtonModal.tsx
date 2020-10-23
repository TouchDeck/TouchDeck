import React, { useCallback, useState } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import Modal from '../Modal';
import Button from '../Button';
import TextInput from '../input/TextInput';
import ButtonStyleSettings from '../settings/ButtonStyleSettings';
import ButtonActionSettings from '../settings/ButtonActionSettings';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import ButtonGroup from '../ButtonGroup';

export interface Props {
  button: ButtonConfig;
  onClose: () => void;
}

const EditButtonModal: React.FC<Props> = ({ button, onClose }) => {
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [updates, setUpdates] = useState<ButtonConfig>({ ...button });

  const onSave = useCallback(async () => {
    dispatch({ type: 'configLoading' });
    const newConfig = await agent.upsertButton({
      ...updates,
      id: button.id,
    });
    dispatch({ type: 'configLoaded', config: newConfig });
    onClose();
  }, [agent, button.id, dispatch, updates, onClose]);

  return (
    <Modal className="edit-button" active onClose={onClose}>
      <TextInput
        className="name"
        value={updates.name}
        onChange={(name) => setUpdates((prevState) => ({ ...prevState, name }))}
      />
      <div className="columns">
        {'action' in updates && (
          <ButtonActionSettings
            action={updates.action}
            onChange={(action) =>
              setUpdates((prevState) => ({ ...prevState, action }))
            }
          />
        )}
        {'style' in updates && (
          <ButtonStyleSettings
            buttonStyle={updates.style}
            onChange={(style) =>
              setUpdates((prevState) => ({ ...prevState, style }))
            }
          />
        )}
        {'trueStyle' in updates && (
          <ButtonStyleSettings
            buttonStyle={updates.trueStyle}
            onChange={(style) =>
              setUpdates((prevState) => ({
                ...prevState,
                trueStyle: style,
              }))
            }
          />
        )}
        {'falseStyle' in updates && (
          <ButtonStyleSettings
            buttonStyle={updates.falseStyle}
            onChange={(style) =>
              setUpdates((prevState) => ({
                ...prevState,
                falseStyle: style,
              }))
            }
          />
        )}
      </div>
      <ButtonGroup className="actions">
        <Button onClick={onSave} positive icon="save">
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ButtonGroup>
    </Modal>
  );
};

export default EditButtonModal;

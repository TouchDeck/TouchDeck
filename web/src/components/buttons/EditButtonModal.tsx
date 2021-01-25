import React, { useCallback, useState } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import Modal from '../Modal';
import Button from '../Button';
import { TextInput } from '../input/TextInput';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import ButtonGroup from '../ButtonGroup';
import { EditFolderButton } from './EditFolderButton';
import { EditActionButton } from './EditActionButton';

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

  const onDelete = useCallback(async () => {
    dispatch({ type: 'configLoading' });
    const newConfig = await agent.deleteButton(button.id);
    dispatch({ type: 'configLoaded', config: newConfig });
    onClose();
  }, [agent, button.id, dispatch, onClose]);

  return (
    <Modal className="edit-button" active onClose={onClose}>
      <TextInput
        className="name"
        value={updates.name}
        onChange={(name) => setUpdates((prevState) => ({ ...prevState, name }))}
        placeholder="Button name"
      />
      <div className="columns">
        {updates.type === 'folder' && (
          <EditFolderButton
            button={updates}
            setButtonStyle={(style) =>
              setUpdates((prevState) => ({ ...prevState, style }))
            }
          />
        )}
        {(updates.type === 'normal' || updates.type === 'toggle') && (
          <EditActionButton button={updates} setButton={setUpdates} />
        )}
      </div>
      <div className="actions">
        <Button onClick={onDelete} negative icon="trash">
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} positive icon="save">
            Save
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default EditButtonModal;

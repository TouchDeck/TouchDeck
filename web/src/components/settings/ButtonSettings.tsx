import React, { useCallback, useEffect, useState } from 'react';
import {
  ButtonConfig,
  ButtonType,
} from '../../model/configuration/ButtonConfig';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import ButtonStyleSettings from './ButtonStyleSettings';
import ButtonActionSettings from './ButtonActionSettings';
import Rows from '../Rows';
import TextInput from '../input/TextInput';
import newButton from '../../util/newButton';
import Icon from '../Icon';
import Modal from '../Modal';
import ButtonGroup from '../ButtonGroup';

export interface Props {
  button: ButtonConfig;
  onClose: () => void;
}

const ButtonSettings: React.FC<Props> = ({ button, onClose }) => {
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [updates, setUpdates] = useState<ButtonConfig>({ ...button });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onSave = useCallback(async () => {
    dispatch({ type: 'configLoading' });
    const newConfig = await agent.setButton(button.id, updates);
    dispatch({ type: 'configLoaded', config: newConfig });
  }, [agent, button.id, dispatch, updates]);

  const onDelete = useCallback(async () => {
    dispatch({ type: 'configLoading' });
    const newConfig = await agent.deleteButton(button.id);
    dispatch({ type: 'configLoaded', config: newConfig });
    onClose();
  }, [agent, button.id, dispatch, onClose]);

  // Reset the updates whenever the button changes.
  useEffect(() => setUpdates(button), [button]);

  return (
    <div className="button-settings">
      <Modal active={confirmDelete}>
        <h3>Delete button "{button.name}"?</h3>
        <p>This action is permanent and cannot be undone.</p>
        <div>
          <button onClick={onDelete}>Delete</button>
          <button onClick={() => setConfirmDelete(false)}>Cancel</button>
        </div>
      </Modal>
      <div className="close-wrapper">
        <Icon icon="times" size={2} onClick={onClose} />
      </div>
      <Rows>
        <div>
          <span>Name</span>
          <TextInput
            value={updates.name}
            onChange={(name) =>
              setUpdates((prevState) => ({ ...prevState, name }))
            }
          />
        </div>
        <div>
          <span>Type</span>
          <select
            value={updates.type}
            onChange={(e) => {
              const newType = e.currentTarget.value as ButtonType;
              setUpdates((prevState) => newButton(newType, prevState));
            }}
          >
            <option value="normal">Normal</option>
            <option value="toggle">Toggle</option>
            <option value="folder">Folder</option>
          </select>
        </div>
      </Rows>
      {'style' in updates && (
        <ButtonStyleSettings
          buttonStyle={updates.style}
          onChange={(style) =>
            setUpdates((prevState) => ({ ...prevState, style }))
          }
        />
      )}
      {'action' in updates && (
        <ButtonActionSettings
          action={updates.action}
          onChange={(action) =>
            setUpdates((prevState) => ({ ...prevState, action }))
          }
        />
      )}
      {'state1' in updates && (
        <>
          <ButtonStyleSettings
            buttonStyle={updates.state1.style}
            onChange={(style) =>
              setUpdates((prevState) => ({
                ...prevState,
                state1: { ...updates.state1, style },
              }))
            }
          />
          <ButtonActionSettings
            action={updates.state1.action}
            onChange={(action) =>
              setUpdates((prevState) => ({
                ...prevState,
                state1: { ...updates.state1, action },
              }))
            }
          />
        </>
      )}
      {'state2' in updates && (
        <>
          <ButtonStyleSettings
            buttonStyle={updates.state2.style}
            onChange={(style) =>
              setUpdates((prevState) => ({
                ...prevState,
                state2: { ...updates.state2, style },
              }))
            }
          />
          <ButtonActionSettings
            action={updates.state2.action}
            onChange={(action) =>
              setUpdates((prevState) => ({
                ...prevState,
                state2: { ...updates.state2, action },
              }))
            }
          />
        </>
      )}
      <ButtonGroup>
        <button onClick={onSave}>
          <Icon icon="save" /> Save
        </button>
        <button onClick={() => setConfirmDelete(true)}>
          <Icon icon="trash" /> Delete
        </button>
      </ButtonGroup>
    </div>
  );
};

export default ButtonSettings;

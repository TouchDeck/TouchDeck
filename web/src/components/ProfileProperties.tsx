import React, { useEffect, useState } from 'react';
import { Profile } from 'touchdeck-model';
import { TextInput } from './input/TextInput';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

export interface Props {
  profile: Profile;
  onDelete: () => void;
  onClose: () => void;
  isDefaultProfile: boolean;
}

export const ProfileProperties: React.FC<Props> = ({
  profile,
  isDefaultProfile,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState('');

  useEffect(() => setName(profile.name), [profile.name]);

  return (
    <div className="profile-properties properties">
      <TextInput
        className="name"
        value={name}
        onChange={setName}
        placeholder="Profile name"
      />
      <div className="default">
        <Button disabled={isDefaultProfile}>Set as default</Button>
        <span>This is the default profile.</span>
      </div>
      <div className="actions">
        <Button
          icon="trash"
          negative
          onClick={onDelete}
          disabled={isDefaultProfile}
        >
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => undefined}
            positive
            icon="save"
            disabled={!name}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

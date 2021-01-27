import React, { useEffect, useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import ButtonList from '../components/buttons/ButtonList';
import { ButtonConfig } from 'touchdeck-model';
import newButton from '../util/newButton';
import EditButtonModal from '../components/buttons/EditButtonModal';

export interface Props {
  editing?: boolean;
}

export const DeckPage: React.FC<Props> = ({ editing }) => {
  const [selectedButton, setSelectedButton] = useState<ButtonConfig>();

  useEffect(() => {
    if (!editing) {
      setSelectedButton(undefined);
    }
  }, [editing]);

  return (
    <main className="deck">
      {editing && (
        <div className="edit-panel">
          <ButtonList
            onClickButton={setSelectedButton}
            onCreateActionButton={() => setSelectedButton(newButton('normal'))}
            onCreateFolder={() => setSelectedButton(newButton('folder'))}
          />
          {selectedButton && (
            <EditButtonModal
              button={selectedButton}
              onClose={() => setSelectedButton(undefined)}
            />
          )}
        </div>
      )}
      <ButtonGrid rowCount={3} columnCount={5} editing={editing} />
    </main>
  );
};

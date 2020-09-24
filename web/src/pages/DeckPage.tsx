import React, { useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import ButtonList from '../components/buttons/ButtonList';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import ButtonSettings from '../components/settings/ButtonSettings';

export interface Props {
  editing?: boolean;
}

const DeckPage: React.FC<Props> = ({ editing }) => {
  const [selectedButton, setSelectedButton] = useState<ButtonConfig>();

  return (
    <main className="deck">
      {editing && (
        <div className="edit-panel">
          <ButtonList onClickButton={setSelectedButton} />
          {selectedButton && <ButtonSettings button={selectedButton} />}
        </div>
      )}
      <ButtonGrid rowCount={3} columnCount={5} editing={editing} />
    </main>
  );
};

export default DeckPage;

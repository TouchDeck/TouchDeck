import React, { useState } from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import SettingsCorner from '../components/settings/SettingsCorner';

const DeckPage: React.FC = () => {
  // TODO
  const [editing, setEditing] = useState(false);

  return (
    <>
      <SettingsCorner />
      <ButtonGrid rowCount={3} columnCount={5} editing />
    </>
  );
};

export default DeckPage;

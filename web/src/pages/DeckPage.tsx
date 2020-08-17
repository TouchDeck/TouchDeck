import React, { useEffect, useState } from 'react';
import ButtonGrid from '../components/ButtonGrid';
import { ButtonConfig, getButtonConfiguration } from '../api/configuration';
import SettingsCorner from '../components/SettingsCorner';

const DeckPage: React.FC = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  useEffect((): void => {
    setButtons(getButtonConfiguration());
  }, []);

  return (
    <>
      <SettingsCorner />
      <ButtonGrid rowWidth={4} buttons={buttons} />
    </>
  );
};

export default DeckPage;

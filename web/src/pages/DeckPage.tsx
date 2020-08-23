import React from 'react';
import ButtonGrid from '../components/ButtonGrid';
import SettingsCorner from '../components/SettingsCorner';
import { useGlobalState } from '../state/appState';

const DeckPage: React.FC = () => {
  const [state] = useGlobalState();
  const { config } = state;

  if (config.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <SettingsCorner />
      <ButtonGrid rowWidth={4} buttons={config.config.buttons} />
    </>
  );
};

export default DeckPage;

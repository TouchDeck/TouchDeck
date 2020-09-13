import React from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import SettingsCorner from '../components/settings/SettingsCorner';
import { useAgent, useConfig } from '../state/appState';

const DeckPage: React.FC = () => {
  const config = useConfig();
  const agent = useAgent();

  return (
    <>
      <SettingsCorner />
      <ButtonGrid
        rowWidth={4}
        buttons={config.buttons}
        onTriggerAction={(id) => agent.triggerAction(id)}
      />
    </>
  );
};

export default DeckPage;

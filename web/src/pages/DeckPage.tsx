import React from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import SettingsCorner from '../components/settings/SettingsCorner';
import { useConnectedAgent } from '../state/appState';

const DeckPage: React.FC = () => {
  const { agent, config } = useConnectedAgent();

  return (
    <>
      <SettingsCorner />
      <ButtonGrid
        rowCount={3}
        columnCount={5}
        buttons={config.buttons}
        onTriggerAction={(id) => agent.triggerAction(id)}
        editing
      />
    </>
  );
};

export default DeckPage;

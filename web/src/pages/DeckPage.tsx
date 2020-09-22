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
        rows={3}
        columns={5}
        buttons={config.buttons}
        onTriggerAction={(id) => agent.triggerAction(id)}
      />
    </>
  );
};

export default DeckPage;

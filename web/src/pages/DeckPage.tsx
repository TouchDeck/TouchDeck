import React from 'react';
import ButtonGrid from '../components/buttons/ButtonGrid';
import SettingsCorner from '../components/settings/SettingsCorner';
import { useAgent, useGlobalState } from '../state/appState';

const DeckPage: React.FC = () => {
  const [state] = useGlobalState();
  const { config } = state;
  const agent = useAgent();

  if (!config.config) {
    return <>Loading...</>;
  }

  return (
    <>
      <SettingsCorner />
      <ButtonGrid
        rowWidth={4}
        buttons={config.config.buttons}
        onTriggerAction={(id) => agent.triggerAction(id)}
      />
    </>
  );
};

export default DeckPage;

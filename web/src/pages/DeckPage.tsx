import React from 'react';
import ButtonGrid from '../components/ButtonGrid';
import SettingsCorner from '../components/SettingsCorner';
import { useAgent, useGlobalState } from '../state/appState';

const DeckPage: React.FC = () => {
  const [state] = useGlobalState();
  const { config } = state;
  const agent = useAgent();

  if (config.loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <SettingsCorner />
      <ButtonGrid
        rowWidth={4}
        buttons={config.config.buttons}
        onTriggerAction={agent.triggerAction}
      />
    </>
  );
};

export default DeckPage;

import React, { useEffect, useState } from 'react';
import ButtonList from '../components/ButtonList';
import { ActionOption } from '../api/actions';
import { useAgent, useGlobalState } from '../state/appState';
import SettingsLayout from '../components/SettingsLayout';

const ButtonsSettingsPage: React.FC = () => {
  const [state] = useGlobalState();
  const { config } = state;
  const agent = useAgent();

  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);

  useEffect((): void => {
    agent.getActionOptions().then((options) => setActionOptions(options));
  }, [agent]);

  if (config.loading) {
    return <>Loading...</>;
  }

  return (
    <SettingsLayout>
      <ButtonList buttons={config.config.buttons} />
      <div className="button-settings"></div>
    </SettingsLayout>
  );
};

export default ButtonsSettingsPage;

import React, { useEffect, useState } from 'react';
import ButtonList from '../components/buttons/ButtonList';
import ActionOption from '../model/ActionOption';
import { useAgent, useConfig } from '../state/appState';
import SettingsLayout from '../components/settings/SettingsLayout';

const ButtonsSettingsPage: React.FC = () => {
  const config = useConfig();
  const agent = useAgent();

  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);

  useEffect((): void => {
    agent.getActionOptions().then((options) => setActionOptions(options));
  }, [agent]);

  // TODO
  return (
    <SettingsLayout>
      <ButtonList buttons={config.buttons} />
      <div className="button-settings"></div>
    </SettingsLayout>
  );
};

export default ButtonsSettingsPage;

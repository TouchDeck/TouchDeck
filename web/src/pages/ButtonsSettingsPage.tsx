import React, { useEffect, useState } from 'react';
import ButtonList from '../components/ButtonList';
import { ActionOption, getActionOptions } from '../api/actions';
import { useGlobalState } from '../state/appState';
import SettingsLayout from '../components/SettingsLayout';

const ButtonsSettingsPage: React.FC = () => {
  const [state] = useGlobalState();
  const { config } = state;

  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);

  useEffect((): void => {
    getActionOptions().then((options) => setActionOptions(options));
  }, []);

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

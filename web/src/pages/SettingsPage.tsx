import React, { useEffect, useState } from 'react';
import ButtonList from '../components/ButtonList';
import { ActionOption, getActionOptions } from '../api/actions';
import { useGlobalState } from '../state/appState';

const SettingsPage: React.FC = () => {
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
    <>
      <ButtonList buttons={config.config.buttons} />
      <div className="button-settings"></div>
    </>
  );
};

export default SettingsPage;

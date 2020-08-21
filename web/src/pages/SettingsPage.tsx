import React, { useEffect, useState } from 'react';
import { ButtonConfig, getButtonConfiguration } from '../api/configuration';
import ButtonList from '../components/ButtonList';
import { ActionOption, getActionOptions } from '../api/actions';

const SettingsPage: React.FC = () => {
  const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);

  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

  useEffect((): void => {
    getActionOptions().then((options) => setActionOptions(options));
  }, []);

  useEffect((): void => {
    setButtons(getButtonConfiguration());
  }, []);

  return (
    <>
      <ButtonList buttons={buttons} />
      <div className="button-settings"></div>
    </>
  );
};

export default SettingsPage;

import React, { useEffect, useState } from 'react';
import { ButtonConfig, getButtonConfiguration } from '../api/configuration';
import ButtonList from '../components/ButtonList';

const SettingsPage: React.FC = () => {
  const [buttons, setButtons] = useState<ButtonConfig[]>([]);

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

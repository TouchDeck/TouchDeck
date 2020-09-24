import React, { useState } from 'react';
import ButtonList from '../components/buttons/ButtonList';
import SettingsLayout from '../components/settings/SettingsLayout';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import ButtonSettings from '../components/settings/ButtonSettings';

const ButtonsSettingsPage: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<ButtonConfig>();

  return (
    <SettingsLayout>
      <main className="buttons-settings">
        <ButtonList onClickButton={(button) => setSelectedButton(button)} />
        {selectedButton && <ButtonSettings button={selectedButton} />}
      </main>
    </SettingsLayout>
  );
};

export default ButtonsSettingsPage;

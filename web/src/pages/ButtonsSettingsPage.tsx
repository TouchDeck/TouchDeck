import React, { useState } from 'react';
import ButtonList from '../components/buttons/ButtonList';
import { useConnectedAgent } from '../state/appState';
import SettingsLayout from '../components/settings/SettingsLayout';
import { ButtonConfig } from '../model/configuration/ButtonConfig';
import ButtonSettings from '../components/settings/ButtonSettings';

const ButtonsSettingsPage: React.FC = () => {
  const { config } = useConnectedAgent();

  const [selectedButton, setSelectedButton] = useState<ButtonConfig>();

  return (
    <SettingsLayout>
      <main className="buttons-settings">
        <ButtonList
          buttons={config.buttons}
          onClickButton={(button) => setSelectedButton(button)}
        />
        {selectedButton && <ButtonSettings button={selectedButton} />}
      </main>
    </SettingsLayout>
  );
};

export default ButtonsSettingsPage;

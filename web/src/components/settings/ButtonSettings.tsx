import React from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import NormalButtonSettings from './NormalButtonSettings';

export interface Props {
  button: ButtonConfig;
}

const ButtonSettings: React.FC<Props> = ({ button }) => {
  return (
    <div className="button-settings">
      {button.type === 'normal' && <NormalButtonSettings button={button} />}
    </div>
  );
};

export default ButtonSettings;

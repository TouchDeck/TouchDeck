import React from 'react';
import ButtonStyleSettings from '../settings/ButtonStyleSettings';
import {
  ButtonStyling,
  FolderButtonConfig,
} from '../../model/configuration/ButtonConfig';

export interface Props {
  button: FolderButtonConfig;
  setButtonStyle: (style: ButtonStyling) => void;
}

export const EditFolderButton: React.FC<Props> = ({
  button,
  setButtonStyle,
}) => (
  <>
    <div>
      <h3>Style</h3>
      <ButtonStyleSettings
        buttonStyle={button.style}
        onChange={setButtonStyle}
      />
    </div>
  </>
);

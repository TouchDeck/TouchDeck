import React from 'react';
import Button, { ButtonProps } from './Button';
import Icon from '../Icon';
import {
  ButtonConfig,
  FolderButtonConfig,
} from '../../model/configuration/ButtonConfig';

export interface Props extends ButtonProps {
  enterFolder: (buttons: ButtonConfig[]) => void;
}

const FolderButton: React.FC<Props & FolderButtonConfig> = (button) => (
  <Button {...button} onClick={(): void => button.enterFolder(button.buttons)}>
    {!button.style.image && !button.style.text && (
      <Icon icon="folder-open" size={3} />
    )}
  </Button>
);

export default FolderButton;

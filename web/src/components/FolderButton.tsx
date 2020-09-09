import React from 'react';
import Button from './Button';
import { Buttons, FolderButtonConfig } from '../api/buttons';
import Icon from './Icon';

export interface Props {
  enterFolder: (buttons: Buttons) => void;
}

const FolderButton: React.FC<Props & FolderButtonConfig> = (button) => (
  <Button {...button} onClick={(): void => button.enterFolder(button.buttons)}>
    {!button.image && !button.text && <Icon icon="folder-open" size={3} />}
  </Button>
);

export default FolderButton;

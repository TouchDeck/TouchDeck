import React from 'react';
import Button from './Button';
import { Buttons, FolderButtonConfig } from '../api/configuration';

export interface Props {
  enterFolder: (buttons: Buttons) => void;
}

const FolderButton: React.FC<Props & FolderButtonConfig> = (button) => (
  <Button {...button} onClick={(): void => button.enterFolder(button.buttons)} />
);

export default FolderButton;

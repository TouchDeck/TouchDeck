import React from 'react';
import Button, { ButtonProps } from './Button';
import Icon from '../Icon';
import { FolderButtonConfig } from '../../model/configuration/ButtonConfig';

export interface Props extends ButtonProps {
  onClick?: () => void | Promise<void>;
}

const FolderButton: React.FC<Props & FolderButtonConfig> = (button) => (
  <Button {...button}>
    {!button.style.image && !button.style.text && (
      <Icon icon="folder-open" size={3} />
    )}
  </Button>
);

export default FolderButton;

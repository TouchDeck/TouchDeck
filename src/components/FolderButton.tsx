import React from 'react';
import Button from './Button';
import { FolderButtonConfig } from '../api/configuration';

const FolderButton: React.FC<FolderButtonConfig> = (button) => (
  <Button {...button} />
);

export default FolderButton;

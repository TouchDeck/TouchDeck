import React from 'react';
import { ButtonConfig } from './api/configuration';
import Button from './components/Button';
import ToggleButton from './components/ToggleButton';
import FolderButton from './components/FolderButton';
import NormalButton from './components/NormalButton';

export default function getButtonFromConfig(
  button: ButtonConfig,
  index: number
) {
  switch (button.type) {
    case 'filler':
      return <Button key={index} disabled />;
    case 'normal':
      return <NormalButton key={index} {...button} />;
    case 'toggle':
      return <ToggleButton key={index} {...button} />;
    case 'folder':
      return <FolderButton key={index} {...button} />;
  }
}

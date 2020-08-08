import React from 'react';
import Button from './Button';
import { NormalButtonConfig } from '../api/configuration';
import { triggerAction } from '../api/actions';

const NormalButton: React.FC<NormalButtonConfig> = (button) => (
  <Button {...button} onClick={(): void => triggerAction(button.uuid)} />
);

export default NormalButton;

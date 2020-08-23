import React from 'react';
import Button from './Button';
import { NormalButtonConfig } from '../api/buttons';
import { triggerAction } from '../api/actions';

const NormalButton: React.FC<NormalButtonConfig> = (button) => (
  <Button {...button} onClick={() => triggerAction(button.uuid)} />
);

export default NormalButton;

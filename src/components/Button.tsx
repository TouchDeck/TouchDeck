import React from 'react';
import { triggerAction } from '../api/actions';
import { ButtonConfig } from '../api/configuration';

const Button: React.FC<ButtonConfig> = ({ children, disabled, uuid }) => (
  <div className={`button ${disabled ? 'disabled' : ''}`} onClick={() => {
    if (uuid) {
      triggerAction(uuid);
    }
  }}>
    {children}
  </div>
);

export default Button;

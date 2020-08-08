import React from 'react';
import { triggerAction } from '../api/actions';
import { ButtonConfig } from '../api/configuration';

const Button: React.FC<ButtonConfig> = ({ children, disabled, uuid, backgroundColor, textColor }) => (
  <div
    className={`button ${disabled ? 'disabled' : ''}`}
    style={{
      backgroundColor,
      color: textColor
    }}
    onClick={() => {
      if (uuid) {
        triggerAction(uuid);
      }
    }}
  >
    {children}
  </div>
);

export default Button;

import React from 'react';

export interface Props {
  disabled?: boolean;
}

const Button: React.FC<Props> = ({ children, disabled }) => (
  <div className={`button ${disabled ? 'disabled' : ''}`}>
    {children}
  </div>
);

export default Button;

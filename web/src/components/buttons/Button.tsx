import React from 'react';
import classNames from '../../util/classNames';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';

export interface Props {
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  style: ButtonStyling;
}

const Button: React.FC<Props> = ({ children, disabled, onClick, style }) => (
  <div
    className={classNames(['button', disabled && 'disabled'])}
    style={{
      backgroundColor: style.backgroundColor,
      color: style.textColor,
      backgroundImage: style.image ? `url(/images/${style.image})` : '',
    }}
    onClick={onClick}
  >
    {style.text}
    {children}
  </div>
);

export default Button;

import React from 'react';
import classNames from '../util/classNames';

export interface Props {
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  text?: string;
  image?: string;
}

const Button: React.FC<Props> = ({
  children,
  backgroundColor,
  textColor,
  disabled,
  text,
  onClick,
  image,
}) => (
  <div
    className={classNames(['button', disabled && 'disabled'])}
    style={{
      backgroundColor,
      color: textColor,
      backgroundImage: image ? `url(/images/${image})` : '',
    }}
    onClick={onClick}
  >
    {text}
    {children}
  </div>
);

export default Button;

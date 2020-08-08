import React from 'react';

export interface Props {
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  onClick?: () => void;
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
    className={`button ${disabled ? 'disabled' : ''}`}
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

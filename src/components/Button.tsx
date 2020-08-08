import React from 'react';

export interface Props {
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  onClick?: () => void;
  text?: string;
}

const Button: React.FC<Props> = ({ backgroundColor, textColor, disabled, text, onClick }) => {
  return (
    <div
      className={`button ${disabled ? 'disabled' : ''}`}
      style={{
        backgroundColor,
        color: textColor
      }}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Button;

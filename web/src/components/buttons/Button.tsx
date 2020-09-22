import React from 'react';
import classNames from '../../util/classNames';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';

export interface Props {
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  style: ButtonStyling;
  size?: number;
  buttonsPerRow?: number;
}

const Button: React.FC<Props> = ({
  children,
  disabled,
  onClick,
  style,
  size,
  buttonsPerRow,
}) => {
  const wrapperStyle: { width?: string } = {};
  if (buttonsPerRow) {
    wrapperStyle.width = `calc(100% / ${buttonsPerRow})`;
  }

  return (
    <div className="button-wrapper" style={wrapperStyle}>
      <div
        className={classNames(['button', disabled && 'disabled'])}
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          backgroundImage: style.image ? `url(/api/images/${style.image})` : '',
          width: size,
          height: size,
        }}
        onClick={onClick}
      >
        {style.text}
        {children}
      </div>
    </div>
  );
};

export default Button;

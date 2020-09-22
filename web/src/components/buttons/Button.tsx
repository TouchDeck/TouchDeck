import React from 'react';
import classNames from '../../util/classNames';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';

export interface ButtonProps {
  size?: number;
  buttonsPerRow?: number;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
}

export interface Props extends ButtonProps {
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  style: ButtonStyling;
}

const Button: React.FC<Props> = ({
  children,
  disabled,
  onClick,
  style,
  size,
  buttonsPerRow,
  draggable,
  onDragStart,
  onDragEnd,
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
          // TODO: Load image from agent, remove proxy from package.json
          backgroundImage: style.image ? `url(/api/images/${style.image})` : '',
          width: size,
          height: size,
        }}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable={draggable}
      >
        {style.text}
        {children}
      </div>
    </div>
  );
};

export default Button;

import React from 'react';
import classNames from '../../util/classNames';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';
import { useConnectedAgent } from '../../state/appState';
import Icon from '../Icon';

export interface ButtonProps {
  size?: number;
  buttonsPerRow?: number;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  editing?: boolean;
  onDelete?: () => void;
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
  onDragOver,
  onDrop,
  editing,
  onDelete,
}) => {
  const wrapperStyle: { width?: string } = {};
  if (buttonsPerRow) {
    wrapperStyle.width = `calc(100% / ${buttonsPerRow})`;
  }

  const { info } = useConnectedAgent();

  return (
    <div
      className="button-wrapper"
      style={wrapperStyle}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        className={classNames(['button', disabled && 'disabled'])}
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          backgroundImage: style.image
            ? `url(http://${info.address}/api/images/${style.image})`
            : '',
          width: size,
          height: size,
        }}
        onClick={onClick}
        draggable={draggable}
        onDragEnd={onDragEnd}
      >
        {style.text}
        {children}
      </div>
      {editing && (
        <div
          className={classNames(['delete', onDelete && 'show'])}
          style={{
            top: `${(size || 0) / 2}px`,
          }}
          onClick={onDelete}
        >
          {onDelete && <Icon icon="trash" />}
        </div>
      )}
    </div>
  );
};

export default Button;

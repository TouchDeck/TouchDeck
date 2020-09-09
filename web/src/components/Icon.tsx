import React from 'react';
import classNames from '../util/classNames';

export interface Props {
  icon: string;
  iconStyle?: 'solid' | 'brands';
  size?: number;
  pulse?: boolean;
}

const Icon: React.FC<Props> = ({ icon, iconStyle, size, pulse }) => (
  <i
    className={classNames([
      `fa${(iconStyle || 's').charAt(0)}`,
      `fa-${icon}`,
      size && `fa-${size}x`,
      pulse && 'fa-pulse',
    ])}
  />
);

export default Icon;

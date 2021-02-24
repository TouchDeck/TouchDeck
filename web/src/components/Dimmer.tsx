import React from 'react';
import { classNames } from '../util/classNames';

export interface Props {
  active: boolean;
  className?: string;
}

export const Dimmer: React.FC<Props> = ({ children, active, className }) => (
  <div className={classNames(['dimmer', active && 'active', className])}>
    {children}
  </div>
);

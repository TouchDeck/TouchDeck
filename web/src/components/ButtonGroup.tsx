import React from 'react';
import { classNames } from '../util/classNames';

export interface Props {
  className?: string;
}

export const ButtonGroup: React.FC<Props> = ({ children, className }) => (
  <div className={classNames(['button-group', className])}>{children}</div>
);

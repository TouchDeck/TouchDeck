import React from 'react';
import { classNames } from '../util/classNames';

export interface Props {
  compact?: boolean;
}

export const Columns: React.FC<Props> = ({ children, compact }) => (
  <div className={classNames(['columns', compact && 'compact'])}>
    {children}
  </div>
);

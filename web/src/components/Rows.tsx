import React from 'react';
import { classNames } from '../util/classNames';

export interface Props {
  compact?: boolean;
}

export const Rows: React.FC<Props> = ({ children, compact }) => (
  <div className={classNames(['rows', compact && 'compact'])}>{children}</div>
);

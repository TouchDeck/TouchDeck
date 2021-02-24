import React from 'react';
import { classNames } from '../util/classNames';

export interface Props {
  compact?: boolean;
}

const Rows: React.FC<Props> = ({ children, compact }) => (
  <div className={classNames(['rows', compact && 'compact'])}>{children}</div>
);

export default Rows;

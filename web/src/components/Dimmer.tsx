import React from 'react';
import classNames from '../util/classNames';

export interface Props {
  active: boolean;
}

const Dimmer: React.FC<Props> = ({ children, active }) => (
  <div className={classNames(['dimmer', active && 'active'])}>{children}</div>
);

export default Dimmer;

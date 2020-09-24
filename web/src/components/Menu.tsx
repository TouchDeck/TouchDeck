import React from 'react';
import classNames from '../util/classNames';
import Icon from './Icon';

export interface Props {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<Props> = ({ open, onClose }) => (
  <nav className={classNames(['menu', !open && 'closed'])}>
    <div className="close-wrapper" onClick={onClose}>
      <Icon icon="times" size={3} />
    </div>
    <div className="entry">
      <h2>Targets</h2>
    </div>
    <div className="entry">
      <h2>Agent</h2>
    </div>
  </nav>
);

export default Menu;

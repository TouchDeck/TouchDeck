import React from 'react';
import classNames from '../util/classNames';
import Icon from './Icon';

export interface Props {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<Props> = ({ open, onClose }) => (
  <nav className={classNames(['menu', !open && 'closed'])}>
    <Icon className="close" icon="times" size={2} onClick={onClose} />
    <div className="entry">
      <h2>
        <Icon icon="link" />
        Targets
      </h2>
    </div>
    <div className="entry">
      <h2>
        <Icon icon="robot" />
        Agent
      </h2>
    </div>
  </nav>
);

export default Menu;

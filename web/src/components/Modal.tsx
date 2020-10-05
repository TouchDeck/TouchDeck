import React from 'react';
import Dimmer from './Dimmer';

export interface Props {
  active: boolean;
}

const Modal: React.FC<Props> = ({ active, children }) => (
  <Dimmer active={active} className="modal">
    <div>{children}</div>
  </Dimmer>
);

export default Modal;

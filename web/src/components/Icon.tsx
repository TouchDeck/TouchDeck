import React from 'react';

export interface Props {
  icon: string;
  style?: 's' | 'b';
}

const Icon: React.FC<Props> = ({ icon, style }) => (
  <i className={`fa${style || 's'} fa-${icon}`} />
);

export default Icon;

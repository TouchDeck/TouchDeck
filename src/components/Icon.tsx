import React from 'react';

export interface Props {
  icon: string;
}

const Icon: React.FC<Props> = ({ icon }) => <i className={`fas fa-${icon}`} />;

export default Icon;

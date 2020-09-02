import React from 'react';

export interface Props {
  name: string;
}

const TargetRow: React.FC<Props> = ({ name }) => (
  <div className="target-row">
    <img src={`/logos/${name.replace(' ', '_')}.png`} alt={`${name} logo`} />
    <span>{name}</span>
  </div>
);

export default TargetRow;

import React from 'react';

export interface Props {
  name: string;
  onClick: () => void;
}

const TargetRow: React.FC<Props> = ({ name, onClick }) => (
  <div className="target-row" onClick={onClick}>
    <img src={`/logos/${name.replace(' ', '_')}.png`} alt={`${name} logo`} />
    <span>{name}</span>
  </div>
);

export default TargetRow;

import React from 'react';
import { ButtonConfig } from '../api/configuration';
import getButtonFromConfig from '../getButtonFromConfig';

export type Row = ButtonConfig[];

export interface Props {
  rowWidth: number;
  buttons: ButtonConfig[];
}

const ButtonGrid: React.FC<Props> = ({ rowWidth, buttons }) => {
  // Divide the buttons into rows.
  const rows: Row[] = [[]];
  for (let i = 0; i < buttons.length; i++) {
    const lastRow = rows[rows.length - 1];
    if (lastRow.length < rowWidth) {
      lastRow.push(buttons[i]);
    } else {
      rows.push([buttons[i]]);
    }
  }

  // Fill up the last row.
  const lastRow = rows[rows.length - 1];
  for (let i = lastRow.length; i < rowWidth; i++) {
    lastRow.push({ type: 'filler' });
  }

  return (
    <div className="button-grid">
      {rows.map((row, r) => (
        <div key={r} className="button-row">
          {row.map(getButtonFromConfig)}
        </div>
      ))}
    </div>
  );
};

export default ButtonGrid;

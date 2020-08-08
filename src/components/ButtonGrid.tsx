import React from 'react';
import Button from './Button';

export type Row = ButtonDefinition[];

export interface ButtonDefinition {
  text?: string;
  disabled?: boolean;
}

export interface Props {
  rowWidth: number;
  buttons: ButtonDefinition[];
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
    lastRow.push({ disabled: true });
  }

  return (
    <div className="button-grid">
      {rows.map((row) => (
        <div className="button-row">
          {row.map(button => (
            <Button disabled={button.disabled}>{button.text}</Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ButtonGrid;

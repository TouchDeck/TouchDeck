import React, { useCallback, useEffect, useState } from 'react';
import { Buttons } from '../api/configuration';
import Button from './Button';
import NormalButton from './NormalButton';
import ToggleButton from './ToggleButton';
import FolderButton from './FolderButton';
import Icon from './Icon';

export interface Props {
  rowWidth: number;
  buttons: Buttons;
}

const ButtonGrid: React.FC<Props> = ({ rowWidth, buttons }) => {
  const [buttonView, setButtonView] = useState<Buttons>(buttons);

  // Update the button view state whenever the prop changes.
  useEffect(() => setButtonView(buttons), [buttons]);

  const [folderStack, setFolderStack] = useState<Buttons[]>([]);

  const enterFolder = useCallback((folder: Buttons) => {
    setFolderStack((prev) => [...prev, buttonView]);
    setButtonView(folder);
  }, [buttonView]);
  const exitFolder = useCallback(() => {
    setButtonView(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, prev.length - 1));
  }, [folderStack]);

  const rows: Buttons[] = [[]];


  // If we're in a folder (i.e. if the folderStack is not empty) add an 'up' button.
  if (folderStack.length > 0) {
    rows[0][0] = { type: 'up' };
  }

  // Divide the buttons into rows.
  for (let i = 0; i < buttonView.length; i++) {
    const lastRow = rows[rows.length - 1];
    if (lastRow.length < rowWidth) {
      lastRow.push(buttonView[i]);
    } else {
      rows.push([buttonView[i]]);
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
          {row.map((button, i) => {
            switch (button.type) {
              case 'filler':
                return <Button key={i} disabled />;
              case 'normal':
                return <NormalButton key={i} {...button} />;
              case 'toggle':
                return <ToggleButton key={i} {...button} />;
              case 'folder':
                return <FolderButton key={i} {...button} enterFolder={enterFolder} />;
              case 'up':
                return (
                  <Button key={i} onClick={exitFolder}>
                    <Icon icon="level-up-alt fa-3x" />
                  </Button>
                );
              default:
                throw new Error('Unknown button type');
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default ButtonGrid;

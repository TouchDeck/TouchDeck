import React, { useCallback, useEffect, useState } from 'react';
import Button from './Button';
import NormalButton from './NormalButton';
import ToggleButton from './ToggleButton';
import FolderButton from './FolderButton';
import Icon from '../Icon';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';

export interface Props {
  rows: number;
  columns: number;
  buttons: ButtonConfig[];
  onTriggerAction: (action: string) => void;
}

const ButtonGrid: React.FC<Props> = ({ columns, buttons, onTriggerAction }) => {
  const [buttonView, setButtonView] = useState<ButtonConfig[]>(buttons);

  // Update the button view state whenever the prop changes.
  useEffect(() => setButtonView(buttons), [buttons]);

  const [folderStack, setFolderStack] = useState<ButtonConfig[][]>([]);

  const enterFolder = useCallback(
    (folder: ButtonConfig[]) => {
      setFolderStack((prev) => [...prev, buttonView]);
      setButtonView(folder);
    },
    [buttonView]
  );
  const exitFolder = useCallback(() => {
    setButtonView(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, prev.length - 1));
  }, [folderStack]);

  const rows: ButtonConfig[][] = [[]];

  // If we're in a folder (i.e. if the folderStack is not empty) add an 'up' button.
  if (folderStack.length > 0) {
    rows[0][0] = { type: 'up' };
  }

  // Divide the buttons into rows.
  for (let i = 0; i < buttonView.length; i++) {
    const lastRow = rows[rows.length - 1];
    if (lastRow.length < columns) {
      lastRow.push(buttonView[i]);
    } else {
      rows.push([buttonView[i]]);
    }
  }

  // Fill up the last row.
  const lastRow = rows[rows.length - 1];
  for (let i = lastRow.length; i < columns; i++) {
    lastRow.push({ type: 'filler' });
  }

  return (
    <div className="button-grid">
      {rows.map((row, r) => (
        <div key={r} className="button-row">
          {row.map((button, i) => {
            switch (button.type) {
              case 'filler':
                return (
                  <Button
                    key={i}
                    disabled
                    style={{
                      text: '',
                      image: '',
                      backgroundColor: '',
                      textColor: '',
                    }}
                  />
                );
              case 'normal':
                return (
                  <NormalButton
                    key={i}
                    {...button}
                    onTriggerAction={onTriggerAction}
                  />
                );
              case 'toggle':
                return (
                  <ToggleButton
                    key={i}
                    {...button}
                    onTriggerAction={onTriggerAction}
                  />
                );
              case 'folder':
                return (
                  <FolderButton key={i} {...button} enterFolder={enterFolder} />
                );
              case 'up':
                return (
                  <Button
                    key={i}
                    onClick={exitFolder}
                    style={{
                      text: '',
                      image: '',
                      backgroundColor: '',
                      textColor: '',
                    }}
                  >
                    <Icon icon="level-up-alt" size={3} />
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

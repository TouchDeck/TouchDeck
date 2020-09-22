import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';
import NormalButton from './NormalButton';
import ToggleButton from './ToggleButton';
import FolderButton from './FolderButton';
import Icon from '../Icon';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';

export interface Props {
  rowCount: number;
  columnCount: number;
  buttons: ButtonConfig[];
  onTriggerAction: (action: string) => void;
  editing?: boolean;
}

const ButtonGrid: React.FC<Props> = ({
  rowCount,
  columnCount,
  buttons,
  onTriggerAction,
  editing,
}) => {
  // Get the button size, based on the current element size.
  const gridRef = useRef<HTMLDivElement>(null);
  const [buttonSize, setButtonSize] = useState(0);
  useEffect(() => {
    function updateSize() {
      if (gridRef.current) {
        const columnWidth = gridRef.current.clientWidth / columnCount - 64;
        const rowHeight = gridRef.current.clientHeight / rowCount - 64;
        const minSize = Math.min(columnWidth, rowHeight);
        setButtonSize(minSize);
      }
    }

    updateSize();

    // Update the size whenever the window resizes.
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [columnCount, rowCount]);

  const [buttonView, setButtonView] = useState<ButtonConfig[]>(buttons);
  const [folderStack, setFolderStack] = useState<ButtonConfig[][]>([]);

  // Update the button view state whenever the prop changes.
  useEffect(() => setButtonView(buttons), [buttons]);

  // Enter a folder: push an item onto the folder stack and update the button view.
  const enterFolder = useCallback(
    (folder: ButtonConfig[]) => {
      setFolderStack((prev) => [...prev, buttonView]);
      setButtonView(folder);
    },
    [buttonView]
  );

  // Exit a folder: pop an item from the folder stack and update the button view.
  const exitFolder = useCallback(() => {
    setButtonView(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, prev.length - 1));
  }, [folderStack]);

  const [draggingButton, setDraggingButton] = useState<number>();
  const dropButton = useCallback(
    (target: number) => {
      console.log('Dropping', draggingButton, 'over', target);
    },
    [draggingButton]
  );

  // If we're in a folder (i.e. if the folderStack is not empty) add an 'up' button.
  if (folderStack.length > 0) {
    // TODO
    // rows[0][0] = { type: 'up' };
  }

  // Get the button list, fill up the remainder of the grid.
  const renderButtons = [...buttonView];
  for (let i = renderButtons.length; i < rowCount * columnCount; i++) {
    renderButtons.push(null);
  }

  return (
    <div className="button-grid" ref={gridRef}>
      {renderButtons.map((button, i) => {
        if (!button) {
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
              size={buttonSize}
              buttonsPerRow={columnCount}
              draggable={editing}
              onDragOver={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                dropButton(i);
              }}
            />
          );
        }

        switch (button.type) {
          case 'normal':
            return (
              <NormalButton
                key={i}
                {...button}
                onTriggerAction={onTriggerAction}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDraggingButton(i)}
                onDragEnd={() => setDraggingButton(undefined)}
              />
            );
          case 'toggle':
            return (
              <ToggleButton
                key={i}
                {...button}
                onTriggerAction={onTriggerAction}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDraggingButton(i)}
                onDragEnd={() => setDraggingButton(undefined)}
              />
            );
          case 'folder':
            return (
              <FolderButton
                key={i}
                {...button}
                enterFolder={enterFolder}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDraggingButton(i)}
                onDragEnd={() => setDraggingButton(undefined)}
              />
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
                size={buttonSize}
                buttonsPerRow={columnCount}
              >
                <Icon icon="level-up-alt" size={3} />
              </Button>
            );
          default:
            throw new Error('Unknown button type');
        }
      })}
    </div>
  );
};

export default ButtonGrid;

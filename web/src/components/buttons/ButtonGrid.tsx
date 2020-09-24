import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';
import NormalButton from './NormalButton';
import ToggleButton from './ToggleButton';
import FolderButton from './FolderButton';
import Icon from '../Icon';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import { useConnectedAgent, useGlobalState } from '../../state/appState';

export interface Props {
  rowCount: number;
  columnCount: number;
  editing?: boolean;
}

type DisplayButton = ButtonConfig | { type: 'empty' } | { type: 'up' };

const ButtonGrid: React.FC<Props> = ({ rowCount, columnCount, editing }) => {
  const [, dispatch] = useGlobalState();
  const { agent, config } = useConnectedAgent();
  const { buttons, layouts } = config;

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

  const [currentLayout, setCurrentLayout] = useState('root');
  const [buttonView, setButtonView] = useState<DisplayButton[]>(buttons);
  const [folderStack, setFolderStack] = useState<string[]>([]);

  // Update the button view whenever the layout changes.
  useEffect(() => {
    const newLayout = layouts[currentLayout].map<DisplayButton>((id) => {
      if (!id) {
        return { type: 'empty' };
      }

      const found = buttons.find((b) => b.id === id);
      if (!found) {
        throw new Error(`Could not find button with id: ${id}`);
      }
      return found;
    });

    // Fill up the remainder of the grid.
    for (let i = newLayout.length; i < rowCount * columnCount; i++) {
      newLayout.push({ type: 'empty' });
    }

    // If we're in a folder (i.e. if the folderStack is not empty) add an 'up' button.
    // TODO

    setButtonView(newLayout);
  }, [buttons, currentLayout, layouts, rowCount, columnCount]);

  // Enter a folder: push the current layout onto the folder stack and update it.
  const enterFolder = useCallback(
    (folderId: string) => {
      setFolderStack((prev) => [...prev, currentLayout]);
      setCurrentLayout(folderId);
    },
    [currentLayout]
  );

  // Exit a folder: pop an item from the folder stack set it as the current layout.
  const exitFolder = useCallback(() => {
    setCurrentLayout(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, prev.length - 1));
  }, [folderStack]);

  const triggerAction = useCallback(
    (id: string) => {
      if (!editing) {
        agent.triggerAction(id);
      }
    },
    [agent, editing]
  );

  const [draggingButton, setDraggingButton] = useState<number>();
  const dropButton = useCallback(
    (target: number) => {
      if (draggingButton == null) {
        return;
      }

      // TODO

      // const updated = { ...config };
      // updated.buttons[target] = updated.buttons[draggingButton];
      // updated.buttons[draggingButton] = null;

      // Update the agent config.
      // dispatch({ type: 'configLoading' });
      // agent.setConfiguration(updated).then((newConfig) =>
      //   dispatch({
      //     type: 'configLoaded',
      //     config: newConfig,
      //   })
      // );
    },
    [draggingButton, config, dispatch, agent]
  );

  return (
    <div className="button-grid" ref={gridRef}>
      {buttonView.map((button, i) => {
        switch (button.type) {
          case 'normal':
            return (
              <NormalButton
                key={button.id}
                {...button}
                onTriggerAction={triggerAction}
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
                key={button.id}
                {...button}
                onTriggerAction={triggerAction}
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
                key={button.id}
                {...button}
                onClick={() => enterFolder(button.id)}
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
          case 'empty':
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
          default:
            throw new Error('Unknown button type');
        }
      })}
    </div>
  );
};

export default ButtonGrid;

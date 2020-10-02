import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';
import NormalButton from './NormalButton';
import ToggleButton from './ToggleButton';
import FolderButton from './FolderButton';
import Icon from '../Icon';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import useResizeObserver from '../../util/useResizeObserver';

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

  // The button size, based on the current element size.
  const [buttonSize, setButtonSize] = useState(0);
  // A callback to update the button size based on a content rect.
  const updateButtonSize = useCallback(
    (rect: DOMRectReadOnly) => {
      const columnWidth = rect.width / columnCount - 64;
      const rowHeight = rect.height / rowCount - 64;
      const minSize = Math.min(columnWidth, rowHeight);
      setButtonSize(minSize);
    },
    [columnCount, rowCount]
  );
  // The grid ref and its resize observer.
  const gridRef = useRef<HTMLDivElement>(null);
  useResizeObserver(gridRef, updateButtonSize);

  // The current button layout, button view, and folder stack.
  const [currentLayout, setCurrentLayout] = useState('root');
  const [buttonView, setButtonView] = useState<DisplayButton[]>(buttons);
  const [folderStack, setFolderStack] = useState<string[]>([]);

  // Update the button view whenever the layout changes.
  useEffect(() => {
    const newLayout = (layouts[currentLayout] || []).map<DisplayButton>(
      (id) => {
        if (!id) {
          return { type: 'empty' };
        }

        const found = buttons.find((b) => b.id === id);
        if (!found) {
          throw new Error(`Could not find button with id: ${id}`);
        }
        return found;
      }
    );

    // Fill up the remainder of the grid.
    for (let i = newLayout.length; i < rowCount * columnCount; i++) {
      newLayout.push({ type: 'empty' });
    }

    // If we're in a folder (i.e. if the folderStack is not empty) add an 'up' button.
    if (folderStack.length > 0) {
      newLayout[0] = { type: 'up' };
    }

    setButtonView(newLayout);
  }, [
    buttons,
    currentLayout,
    layouts,
    rowCount,
    columnCount,
    folderStack.length,
  ]);

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
    async (id: string) => {
      // Only trigger actions if we are not editing the buttons.
      if (!editing) {
        // Trigger the action, check for errors.
        const result = await agent.triggerAction(id);
        if (!result.success) {
          // TODO
          console.log(result.error);
        }
      }
    },
    [agent, editing]
  );

  // The index of the button that is currently being dragged.
  const [dragIndex, setDragIndex] = useState<number>();
  // Drop the dragged button, with the index of where it's being dropped.
  const dropButton = useCallback(
    (targetIndex: number, buttonId: string) => {
      if (dragIndex == null && !buttonId) {
        return;
      }

      // Copy the config and current layout.
      const updatedConfig = { ...config };
      const updatedLayout = [...updatedConfig.layouts[currentLayout]];

      let targetId: string | null = buttonId;

      // If we're moving a button in the grid, get the id and remove the source.
      if (dragIndex != null) {
        targetId = updatedLayout[dragIndex];
        updatedLayout[dragIndex] = null;
      }

      // Move the button in the layout.
      updatedLayout[targetIndex] = targetId;

      // Update the layout in the copied config.
      updatedConfig.layouts[currentLayout] = updatedLayout;

      // Update the agent config.
      dispatch({ type: 'configLoading' });
      agent.setConfiguration(updatedConfig).then((newConfig) =>
        dispatch({
          type: 'configLoaded',
          config: newConfig,
        })
      );
    },
    [dragIndex, config, currentLayout, dispatch, agent]
  );

  return (
    <div className="button-grid" ref={gridRef}>
      {buttonView.map((button, i) => {
        switch (button.type) {
          case 'normal':
            return (
              <NormalButton
                key={i}
                {...button}
                onTriggerAction={triggerAction}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
              />
            );
          case 'toggle':
            return (
              <ToggleButton
                key={i}
                {...button}
                onTriggerAction={triggerAction}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
              />
            );
          case 'folder':
            return (
              <FolderButton
                key={i}
                {...button}
                onClick={() => enterFolder(button.id)}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
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
                  dropButton(i, e.dataTransfer.getData('button'));
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

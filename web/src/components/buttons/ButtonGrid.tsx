import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GridButton } from './GridButton';
import { Icon } from '../Icon';
import { ButtonConfig, ButtonLayout } from 'touchdeck-model';
import { useConnectedAgent, useGlobalState } from '../../state/appState';
import { useResizeObserver } from '../../hooks/useResizeObserver';

export interface Props {
  rowCount: number;
  columnCount: number;
  editing?: boolean;
  rootLayout: string;
}

type DisplayButton = ButtonConfig | { type: 'empty' } | { type: 'up' };

const buttonMargin = 16;

export const ButtonGrid: React.FC<Props> = ({
  rowCount,
  columnCount,
  editing,
  rootLayout,
}) => {
  const [, dispatch] = useGlobalState();
  const { agent, config, buttonStates } = useConnectedAgent();
  const { buttons, layouts } = config;

  // The button size, based on the current element size.
  const [buttonSize, setButtonSize] = useState(0);
  // A callback to update the button size based on a content rect.
  const updateButtonSize = useCallback(
    (rect: DOMRectReadOnly) => {
      const columnWidth = rect.width / columnCount - buttonMargin;
      const rowHeight = rect.height / rowCount - buttonMargin;
      const minSize = Math.min(columnWidth, rowHeight);
      setButtonSize(minSize);
    },
    [columnCount, rowCount]
  );
  // The grid ref and its resize observer.
  const gridRef = useRef<HTMLDivElement>(null);
  useResizeObserver(gridRef, updateButtonSize);

  // The current button layout (id), button view, and folder stack.
  const [currentLayout, setCurrentLayout] = useState(rootLayout);
  const [buttonView, setButtonView] = useState<DisplayButton[]>(buttons);
  const [folderStack, setFolderStack] = useState<string[]>([]);

  // Update the button view whenever the layout changes.
  useEffect(() => {
    const newLayout = layouts
      .find((l) => l.id === currentLayout)!
      .layout.map<DisplayButton>((id) => {
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
        const result = await agent.pressButton(id);
        if (!result.success) {
          dispatch({
            type: 'error',
            message: result.error,
            id: result.errorId,
          });
        }
      }
    },
    [agent, editing, dispatch]
  );

  const updateLayout = useCallback(
    (newLayout: ButtonLayout) => {
      // Update the agent config.
      dispatch({ type: 'configLoading' });
      agent.setLayout(newLayout).then((newConfig) =>
        dispatch({
          type: 'configLoaded',
          config: newConfig,
        })
      );
    },
    [dispatch, agent]
  );

  // The index of the button that is currently being dragged.
  const [dragIndex, setDragIndex] = useState<number>();
  // Drop the dragged button, with the index of where it's being dropped.
  const dropButton = useCallback(
    (targetIndex: number, buttonId: string) => {
      if (dragIndex == null && !buttonId) {
        return;
      }

      // Copy the current layout.
      const newLayout = { ...layouts.find((l) => l.id === currentLayout)! };

      let targetId: string | null = buttonId;

      // If we're moving a button in the grid, get the id and remove the source.
      if (dragIndex != null) {
        targetId = newLayout.layout[dragIndex];
        newLayout.layout[dragIndex] = null;
      }

      // Move the button in the layout.
      newLayout.layout[targetIndex] = targetId;

      updateLayout(newLayout);
    },
    [dragIndex, layouts, currentLayout, updateLayout]
  );

  const deleteButton = useCallback(
    (deleteIndex: number) => {
      // Copy the current layout.
      const newLayout = { ...layouts.find((l) => l.id === currentLayout)! };
      newLayout.layout[deleteIndex] = null;
      updateLayout(newLayout);
    },
    [layouts, currentLayout, updateLayout]
  );

  return (
    <div className="button-grid" ref={gridRef}>
      {buttonView.map((button, i) => {
        switch (button.type) {
          case 'normal':
            return (
              <GridButton
                key={i}
                {...button}
                onClick={() => triggerAction(button.id)}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
                editing={editing}
                onDelete={() => deleteButton(i)}
              />
            );
          case 'toggle':
            return (
              <GridButton
                key={i}
                {...button}
                style={
                  buttonStates[button.id] ? button.trueStyle : button.falseStyle
                }
                onClick={() => triggerAction(button.id)}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
                editing={editing}
                onDelete={() => deleteButton(i)}
              />
            );
          case 'folder':
            return (
              <GridButton
                key={i}
                {...button}
                onClick={() => enterFolder(button.layout)}
                size={buttonSize}
                buttonsPerRow={columnCount}
                draggable={editing}
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(undefined)}
                editing={editing}
                onDelete={() => deleteButton(i)}
              />
            );
          case 'up':
            return (
              <GridButton
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
                editing={editing}
              >
                <Icon icon="level-up-alt" size={3} />
              </GridButton>
            );
          case 'empty':
            return (
              <GridButton
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
                editing={editing}
              />
            );
          default:
            throw new Error('Unknown button type');
        }
      })}
    </div>
  );
};

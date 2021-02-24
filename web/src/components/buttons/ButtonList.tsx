import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { ButtonConfig } from 'touchdeck-model';
import { useConnectedAgent } from '../../state/appState';
import Button from '../Button';
import { GridButton } from './GridButton';
import ButtonGroup from '../ButtonGroup';
import { List } from '../List';
import { searchEntries } from '../../util/searchEntries';

export interface Props {
  onClickButton: (button: ButtonConfig) => void;
  onCreateActionButton: () => void;
  onCreateFolder: () => void;
}

const ButtonList: React.FC<Props> = ({
  onClickButton,
  onCreateActionButton,
  onCreateFolder,
}) => {
  const { config } = useConnectedAgent();
  const { buttons } = config;

  const [showButtons, setShowButtons] = useState(buttons);
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowButtons(searchEntries(buttons, searchTerm, (b) => b.name));
  }, [buttons, searchTerm]);

  return (
    <List
      searchPlaceholder="Search actions..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <ButtonGroup>
        <Button onClick={onCreateActionButton} icon="plus" positive>
          Action
        </Button>
        <Button onClick={onCreateFolder} icon="folder-open">
          Folder
        </Button>
      </ButtonGroup>
      <div className="entries">
        {showButtons
          .filter((b) => b != null)
          .map((b, i) => buttonToComponent(b, i, onClickButton))}
      </div>
    </List>
  );
};

export default ButtonList;

function buttonToComponent(
  button: ButtonConfig,
  index: number,
  onClickButton: (button: ButtonConfig) => void
): ReactNode {
  if (!button) {
    return <></>;
  }

  return (
    <div
      key={button.id}
      className="entry"
      onClick={() => onClickButton(button)}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('button', button.id)}
    >
      {'style' in button && (
        <GridButton style={button.style} size={48} disabled />
      )}
      {'trueStyle' in button && (
        <GridButton style={button.trueStyle} size={48} disabled />
      )}
      <span className="name">{getButtonNameOrText(button)}</span>
    </div>
  );
}

function getButtonNameOrText(button: ButtonConfig): string {
  let text = button.name;

  // If the button has text and no name, use the text.
  if (!text && 'style' in button) {
    text = button.style.text;
  }

  return text;
}

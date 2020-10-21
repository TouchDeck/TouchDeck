import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';
import { useConnectedAgent } from '../../state/appState';
import TextInput from '../input/TextInput';
import Button from '../Button';
import GridButton from './GridButton';

export interface Props {
  onClickButton: (button: ButtonConfig) => void;
  onCreateButton: () => void;
}

const ButtonList: React.FC<Props> = ({ onClickButton, onCreateButton }) => {
  const { config } = useConnectedAgent();
  const { buttons } = config;

  const [showButtons, setShowButtons] = useState(buttons);
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowButtons(
      buttons
        .filter((b) => filterButton(searchTerm, b))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [buttons, searchTerm]);

  return (
    <div className="button-list">
      <div className="search-wrapper">
        <TextInput
          placeholder="Search..."
          value={searchTerm}
          onChange={setSearchTerm}
          icon="search"
        />
        <Button
          className="create"
          onClick={onCreateButton}
          icon="plus"
          compact
          positive
        />
      </div>
      <div className="list">
        {showButtons
          .filter((b) => b != null)
          .map((b, i) => buttonToComponent(b, i, onClickButton))}
      </div>
    </div>
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

function filterButton(searchTerm: string, button: ButtonConfig): boolean {
  // Split and sanitize the search term.
  const searchTerms = searchTerm
    .toLowerCase()
    .split(' ')
    .filter((t) => !!t);

  if (searchTerms.length === 0) {
    return true;
  }

  // Get all terms to check from the button.
  const checkTerms = [button.name.toLowerCase()];
  if ('style' in button) {
    checkTerms.push(button.style.text.toLowerCase());
  }

  // Check if all search terms match the button.
  for (let searchI = 0; searchI < searchTerms.length; searchI++) {
    // Check all check terms to see if the search term matches anything.
    let matched = false;
    for (let checkI = 0; checkI < checkTerms.length; checkI++) {
      if (checkTerms[checkI].includes(searchTerms[searchI])) {
        matched = true;
      }
    }

    // If this search term matched nothing, return.
    if (!matched) {
      return false;
    }
  }

  return true;
}

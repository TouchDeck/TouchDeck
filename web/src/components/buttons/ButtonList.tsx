import React, { ReactNode } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';

export interface Props {
  buttons: ButtonConfig[];
  onClickButton: (button: ButtonConfig) => void;
}

const ButtonList: React.FC<Props> = ({ buttons, onClickButton }) => {
  return (
    <div className="button-list">
      {buttons
        .filter((b) => b != null)
        .map((b, i) => buttonToComponent(b, i, onClickButton))}
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
    <div key={index}>
      <div className="list-item" onClick={() => onClickButton(button)}>
        {'style' in button && button.style.image && (
          <img alt="" src={`/api/images/${button.style.image}`} />
        )}
        <span className="name">{getButtonNameOrText(button)}</span>
      </div>
    </div>
  );
}

function getButtonNameOrText(button: ButtonConfig): string {
  let text = '';

  // If the button has a name, use that.
  if ('name' in button) {
    text = button.name;
  }

  // If the button has text and no name, use the text.
  if (!text && 'style' in button) {
    text = button.style.text;
  }

  return text;
}

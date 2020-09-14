import React, { ReactNode } from 'react';
import { ButtonConfig } from '../../model/configuration/ButtonConfig';

export interface Props {
  buttons: ButtonConfig[];
  onClickButton: (button: ButtonConfig) => void;
}

const ButtonList: React.FC<Props> = ({ buttons, onClickButton }) => {
  return (
    <div className="button-list">
      {buttons.map((b, i) => buttonToComponent(b, i, onClickButton))}
    </div>
  );
};

export default ButtonList;

function buttonToComponent(
  button: ButtonConfig,
  index: number,
  onClickButton: (button: ButtonConfig) => void
): ReactNode {
  let subButtons: ReactNode[] = [];
  if (button.type === 'folder') {
    subButtons = button.buttons.map((b, i) =>
      buttonToComponent(b, i, onClickButton)
    );
  }
  const buttonName = 'name' in button ? button.name : '';

  return (
    <div key={index}>
      <div className="list-item" onClick={() => onClickButton(button)}>
        {'style' in button && button.style.image && (
          <img alt="" src={`/images/${button.style.image}`} />
        )}
        <span className="name">{buttonName}</span>
      </div>
      <div className="list-folder">{subButtons}</div>
    </div>
  );
}

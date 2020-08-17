import React, { ReactNode } from 'react';
import { ButtonConfig, Buttons } from '../api/configuration';

export interface Props {
  buttons: Buttons;
}

const ButtonList: React.FC<Props> = ({ buttons }) => {
  return <div className="button-list">{buttons.map(buttonToComponent)}</div>;
};

export default ButtonList;

function buttonToComponent(button: ButtonConfig, index: number): ReactNode {
  let subButtons: ReactNode[] = [];
  if (button.type === 'folder') {
    subButtons = button.buttons.map(buttonToComponent);
  }

  return (
    <div key={index}>
      <div
        className="list-item"
        style={{
          backgroundColor: button.backgroundColor,
          color: button.textColor,
        }}
      >
        {'image' in button && button.image && (
          <img alt="" src={`/images/${button.image}`} />
        )}
        <span className="description">{button.description || button.text}</span>
      </div>
      <div className="list-folder">{subButtons}</div>
    </div>
  );
}

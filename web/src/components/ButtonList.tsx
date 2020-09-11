import React, { ReactNode } from 'react';
import { ButtonConfig } from '../model/configuration/ButtonConfig';

export interface Props {
  buttons: ButtonConfig[];
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
  const buttonName = 'name' in button ? button.name : '';

  return (
    <div key={index}>
      <div className="list-item">
        {'image' in button && button.image && (
          <img alt="" src={`/images/${button.image}`} />
        )}
        <span className="name">{buttonName}</span>
      </div>
      <div className="list-folder">{subButtons}</div>
    </div>
  );
}

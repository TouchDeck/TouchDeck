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
        <span className="name">{'name' in button ? button.name : ''}</span>
      </div>
    </div>
  );
}

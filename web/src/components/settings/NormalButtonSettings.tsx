import React, { useEffect, useState } from 'react';
import { NormalButtonConfig } from '../../model/configuration/ButtonConfig';
import Rows from '../Rows';
import ActionOptions from './ActionOptions';

export interface Props {
  button: NormalButtonConfig;
}

const NormalButtonSettings: React.FC<Props> = ({ button }) => {
  const [name, setName] = useState(button.name);
  const [text, setText] = useState(button.text);
  const [textColor, setTextColor] = useState(button.textColor);
  const [backgroundColor, setBackgroundColor] = useState(
    button.backgroundColor
  );
  const [actionType, setActionType] = useState(button.action.type);

  useEffect(() => {
    setName(button.name);
    setText(button.text);
    setTextColor(button.textColor);
    setBackgroundColor(button.backgroundColor);
    setActionType(button.action.type);
  }, [button]);

  return (
    <div>
      <h3>Button</h3>
      <Rows>
        <div>
          <span>Name</span>
          <span>
            <input
              value={name || ''}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </span>
        </div>
        <div>
          <span>Text</span>
          <span>
            <input
              value={text || ''}
              onChange={(e) => setText(e.currentTarget.value)}
            />
          </span>
        </div>
        <div>
          <span>Text color</span>
          <span>
            <input
              value={textColor || ''}
              onChange={(e) => setTextColor(e.currentTarget.value)}
            />
          </span>
        </div>
        <div>
          <span>Background color</span>
          <span>
            <input
              value={backgroundColor || ''}
              onChange={(e) => setBackgroundColor(e.currentTarget.value)}
            />
          </span>
        </div>
      </Rows>

      <h3>Action</h3>
      <Rows>
        <div>
          <span>Type</span>
          <span>
            <ActionOptions
              actionType={actionType}
              onChange={(newAction) => setActionType(newAction)}
            />
          </span>
        </div>
      </Rows>
    </div>
  );
};

export default NormalButtonSettings;

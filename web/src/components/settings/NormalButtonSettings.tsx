import React, { useEffect, useState } from 'react';
import { NormalButtonConfig } from '../../model/configuration/ButtonConfig';
import Rows from '../Rows';
import ActionOptions from './ActionOptions';
import TextInput from '../input/TextInput';

export interface Props {
  button: NormalButtonConfig;
}

const NormalButtonSettings: React.FC<Props> = ({ button }) => {
  const [name, setName] = useState(button.name);
  const [text, setText] = useState(button.style.text);
  const [textColor, setTextColor] = useState(button.style.textColor);
  const [backgroundColor, setBackgroundColor] = useState(
    button.style.backgroundColor
  );
  const [actionType, setActionType] = useState(button.action.type);

  useEffect(() => {
    setName(button.name);
    setText(button.style.text);
    setTextColor(button.style.textColor);
    setBackgroundColor(button.style.backgroundColor);
    setActionType(button.action.type);
  }, [button]);

  return (
    <div>
      <h3>Button</h3>
      <Rows>
        <div>
          <span>Name</span>
          <span>
            <TextInput value={name} onChange={setName} />
          </span>
        </div>
        <div>
          <span>Text</span>
          <span>
            <TextInput value={text} onChange={setText} />
          </span>
        </div>
        <div>
          <span>Text color</span>
          <span>
            <TextInput value={textColor} onChange={setTextColor} />
          </span>
        </div>
        <div>
          <span>Background color</span>
          <span>
            <TextInput value={backgroundColor} onChange={setBackgroundColor} />
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

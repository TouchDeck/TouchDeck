import React from 'react';
import { NormalButtonConfig } from '../../model/configuration/ButtonConfig';
import Rows from '../Rows';

export interface Props {
  button: NormalButtonConfig;
}

const NormalButtonSettings: React.FC<Props> = ({ button }) => {
  return (
    <div>
      <h3>Button</h3>
      <Rows>
        <div>
          <span>Name</span>
          <span>
            <input value={button.name} />
          </span>
        </div>
        <div>
          <span>Text</span>
          <span>
            <input value={button.text} />
          </span>
        </div>
        <div>
          <span>Text color</span>
          <span>
            <input value={button.textColor} />
          </span>
        </div>
        <div>
          <span>Background color</span>
          <span>
            <input value={button.backgroundColor} />
          </span>
        </div>
      </Rows>

      <h3>Action</h3>
      <Rows>
        <div>
          <span>Type</span>
          <span>{button.action.type}</span>
        </div>
      </Rows>
    </div>
  );
};

export default NormalButtonSettings;

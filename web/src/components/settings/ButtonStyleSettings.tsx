import React, { useCallback } from 'react';
import Rows from '../Rows';
import TextInput from '../input/TextInput';
import ColorInput from '../input/ColorInput';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';

export interface Props {
  buttonStyle: ButtonStyling;
  onChange: (style: ButtonStyling) => void;
}

const ButtonStyleSettings: React.FC<Props> = ({ buttonStyle, onChange }) => {
  const setStyleProp = useCallback(
    (prop: keyof ButtonStyling) => (value: string) =>
      onChange({ ...buttonStyle, [prop]: value }),
    [buttonStyle, onChange]
  );

  return (
    <div>
      <h3>Styling</h3>
      <Rows>
        <div>
          <span>Text</span>
          <span>
            <TextInput
              value={buttonStyle.text}
              onChange={setStyleProp('text')}
            />
          </span>
        </div>
        <div>
          <span>Image</span>
          <span>
            <TextInput
              value={buttonStyle.image}
              onChange={setStyleProp('image')}
            />
          </span>
        </div>
        <div>
          <span>Text color</span>
          <span>
            <ColorInput
              value={buttonStyle.textColor}
              onChange={setStyleProp('textColor')}
            />
          </span>
        </div>
        <div>
          <span>Background color</span>
          <span>
            <ColorInput
              value={buttonStyle.backgroundColor}
              onChange={setStyleProp('backgroundColor')}
            />
          </span>
        </div>
      </Rows>
    </div>
  );
};

export default ButtonStyleSettings;

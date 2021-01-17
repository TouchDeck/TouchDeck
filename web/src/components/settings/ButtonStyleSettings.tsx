import React, { useCallback } from 'react';
import Rows from '../Rows';
import TextInput from '../input/TextInput';
import ColorInput from '../input/ColorInput';
import { ButtonStyling } from '../../model/configuration/ButtonConfig';
import { GridButton } from '../buttons/GridButton';
import { ImageInput } from '../input/ImageInput';

export interface Props {
  buttonStyle: ButtonStyling;
  onChange: (style: ButtonStyling) => void;
}

const ButtonStyleSettings: React.FC<Props> = ({ buttonStyle, onChange }) => {
  const setStyleProp = useCallback(
    (prop: keyof ButtonStyling) => (value: string | null) =>
      onChange({ ...buttonStyle, [prop]: value }),
    [buttonStyle, onChange]
  );

  return (
    <div className="button-style-settings">
      <div className="preview-wrapper">
        <GridButton style={buttonStyle} size={64} />
      </div>
      <Rows>
        <div>
          <span>Text</span>
          <TextInput value={buttonStyle.text} onChange={setStyleProp('text')} />
        </div>
        <div>
          <span>Image</span>
          <ImageInput
            value={buttonStyle.image}
            onChange={setStyleProp('image')}
          />
        </div>
        <div>
          <span>Text color</span>
          <ColorInput
            value={buttonStyle.textColor}
            onChange={setStyleProp('textColor')}
          />
        </div>
        <div>
          <span>Background color</span>
          <ColorInput
            value={buttonStyle.backgroundColor}
            onChange={setStyleProp('backgroundColor')}
          />
        </div>
      </Rows>
    </div>
  );
};

export default ButtonStyleSettings;

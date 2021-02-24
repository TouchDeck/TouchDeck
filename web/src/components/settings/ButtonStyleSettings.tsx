import React, { useCallback } from 'react';
import { Rows } from '../Rows';
import { TextInput } from '../input/TextInput';
import { ColorInput } from '../input/ColorInput';
import { ButtonStyling, ImageInfo } from 'touchdeck-model';
import { GridButton } from '../buttons/GridButton';
import { useConnectedAgent } from '../../state/appState';
import { DropdownInput } from '../input/DropdownInput';
import { removeExtension } from '../../util/removeExtension';

export interface Props {
  buttonStyle: ButtonStyling;
  onChange: (style: ButtonStyling) => void;
}

export const ButtonStyleSettings: React.FC<Props> = ({
  buttonStyle,
  onChange,
}) => {
  const { images } = useConnectedAgent();

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
          <DropdownInput<ImageInfo>
            value={removeExtension(buttonStyle.image)}
            options={images}
            onChange={(img) => setStyleProp('image')(img?.path || null)}
            displayValue={(img) => removeExtension(img.path)}
            previewImageUrl={(img) => img.data}
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

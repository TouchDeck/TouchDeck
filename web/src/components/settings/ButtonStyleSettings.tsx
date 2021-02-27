import React, { useCallback } from 'react';
import { TextInput } from '../input/TextInput';
import { ColorInput } from '../input/ColorInput';
import { ButtonStyling, ImageInfo } from 'touchdeck-model';
import { GridButton } from '../buttons/GridButton';
import { useConnectedAgent } from '../../state/appState';
import { DropdownInput } from '../input/DropdownInput';
import { removeExtension } from '../../util/removeExtension';
import { Columns } from '../Columns';

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
      <Columns>
        <div>
          <span>Text</span>
          <span>Image</span>
          <span>Text color</span>
          <span>Background color</span>
        </div>
        <div>
          <TextInput value={buttonStyle.text} onChange={setStyleProp('text')} />
          <DropdownInput<ImageInfo>
            clearable
            value={removeExtension(buttonStyle.image)}
            options={images}
            onChange={(img) => setStyleProp('image')(img?.path || null)}
            displayValue={(img) => removeExtension(img.path)}
            previewImageUrl={(img) => img.data}
          />
          <ColorInput
            value={buttonStyle.textColor}
            onChange={setStyleProp('textColor')}
          />
          <ColorInput
            value={buttonStyle.backgroundColor}
            onChange={setStyleProp('backgroundColor')}
          />
        </div>
      </Columns>
    </div>
  );
};

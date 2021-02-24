import React, { useCallback, useEffect, useState } from 'react';
import { useConnectedAgent } from '../../state/appState';
import { TextInput } from './TextInput';
import { ImageInfo } from 'touchdeck-model';
import { removeExtension } from '../../util/removeExtension';
import { searchEntries } from '../../util/searchEntries';
import { classNames } from '../../util/classNames';

export interface Props {
  value: string;
  onChange: (image: string | null) => void;
}

export const ImageInput: React.FC<Props> = ({ value, onChange }) => {
  const { images } = useConnectedAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayImages, setDisplayImages] = useState(images);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setDisplayImages(searchEntries(images, searchTerm, (i) => i.path));
  }, [images, searchTerm]);

  const selectImage = useCallback(
    (image: ImageInfo) => {
      onChange(image.path);
      setShowDropdown(false);
      setSearchTerm('');
    },
    [onChange]
  );

  const valueString = value ? removeExtension(value) : '';

  return (
    <div
      className="dropdown-input"
      onFocus={() => setShowDropdown(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowDropdown(false);
        }
      }}
    >
      <TextInput
        className={classNames([value ? 'has-value' : 'no-value'])}
        onChange={setSearchTerm}
        value={showDropdown ? searchTerm : valueString}
        placeholder={valueString}
        icon={value ? 'times' : 'chevron-down'}
        onClickIcon={value ? () => onChange(null) : undefined}
      />
      {showDropdown && (
        <div className="dropdown-list">
          {displayImages.map((img) => (
            <div
              key={img.path}
              className="dropdown-entry"
              onClick={() => selectImage(img)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  selectImage(img);
                }
              }}
            >
              <div
                className="preview"
                style={{
                  backgroundImage: `url(${img.data})`,
                }}
              />
              <span className="name">{removeExtension(img.path)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

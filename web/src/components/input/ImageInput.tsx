import React, { useEffect, useState } from 'react';
import { useConnectedAgent } from '../../state/appState';
import TextInput from './TextInput';
import { ImageInfo } from '../../model/messages/ImageInfo';
import removeExtension from '../../util/removeExtension';

export interface Props {
  value: string;
  onChange: (image: string) => void;
}

export const ImageInput: React.FC<Props> = ({ value, onChange }) => {
  const { images } = useConnectedAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayImages, setDisplayImages] = useState(images);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setDisplayImages(images.filter((img) => filterImage(searchTerm, img)));
  }, [images, searchTerm]);

  return (
    <div
      className="image-input"
      onFocus={() => setShowDropdown(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowDropdown(false);
        }
      }}
    >
      <TextInput
        onChange={setSearchTerm}
        value={searchTerm}
        placeholder={removeExtension(value)}
      />
      {showDropdown && (
        <div className="image-list">
          {displayImages.map((img) => (
            <div
              key={img.path}
              className="image-entry"
              onClick={() => {
                onChange(img.path);
                setShowDropdown(false);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(img.path);
                  setShowDropdown(false);
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

function filterImage(searchTerm: string, image: ImageInfo): boolean {
  // Split and sanitize the search term.
  const searchTerms = searchTerm
    .toLowerCase()
    .split(' ')
    .filter((t) => !!t);

  // Check if all search terms match the image.
  for (let searchI = 0; searchI < searchTerms.length; searchI++) {
    if (!image.path.toLowerCase().includes(searchTerms[searchI])) {
      return false;
    }
  }

  return true;
}

import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useConnectedAgent } from '../state/appState';
import Button from './Button';
import { List } from './List';

export interface Props {
  onClickImage: (path: string, data: string) => void;
}

export const ImagesList: React.FC<Props> = ({ onClickImage }) => {
  const { images } = useConnectedAgent();

  const [showImages, setShowImages] = useState(images); // TODO
  const [searchTerm, setSearchTerm] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Check if a file is selected.
    const file = e.currentTarget.files?.item(0);
    if (!file) {
      return;
    }

    // Read the file data.
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        // TODO
        const imageData = reader.result;
      }
    });
    reader.readAsDataURL(file);
  }, []);

  return (
    <List
      className="images-list"
      searchPlaceholder="Search images..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={uploadFile}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        icon="upload"
        positive
      >
        Upload
      </Button>
      <div className="entries">
        {Object.entries(showImages).map(([path, data]) => {
          return (
            <div
              key={path}
              className="entry"
              onClick={() => onClickImage(path, data)}
            >
              <div
                className="preview"
                style={{
                  backgroundImage: `url(${data})`,
                }}
              />
              <span className="name">{path}</span>
            </div>
          );
        })}
      </div>
    </List>
  );
};

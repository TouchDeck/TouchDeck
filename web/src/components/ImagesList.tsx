import React, { useState } from 'react';
import { useConnectedAgent } from '../state/appState';
import TextInput from './input/TextInput';
import Button from './Button';

export const ImagesList: React.FC = () => {
  const { images } = useConnectedAgent();

  const [showImages, setShowImages] = useState(images); // TODO
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="images-list">
      <TextInput
        className="search"
        placeholder="Search images..."
        value={searchTerm}
        onChange={setSearchTerm}
        icon="search"
      />
      <Button onClick={() => undefined} icon="upload" positive>
        Upload
      </Button>
      <div className="list">
        {Object.entries(showImages).map(([path, data]) => {
          return (
            <div key={path} className="entry">
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
    </div>
  );
};

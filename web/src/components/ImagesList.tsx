import React, { useState } from 'react';
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

  return (
    <List
      className="images-list"
      searchPlaceholder="Search images..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <Button onClick={() => undefined} icon="upload" positive>
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

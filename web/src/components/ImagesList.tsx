import React, {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import Button from './Button';
import { List } from './List';
import { ImageInfo } from 'touchdeck-model';
import { removeExtension } from '../util/removeExtension';
import { searchEntries } from '../util/searchEntries';

export interface Props {
  onClickImage: (image: ImageInfo) => void;
}

export const ImagesList: React.FC<Props> = ({ onClickImage }) => {
  const [, dispatch] = useGlobalState();
  const { agent, images } = useConnectedAgent();

  const [showImages, setShowImages] = useState(images);
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowImages(searchEntries(images, searchTerm, (i) => i.path));
  }, [images, searchTerm]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Check if a file is selected.
      const file = e.currentTarget.files?.item(0);
      if (!file) {
        return;
      }

      // Read the file data.
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        if (typeof reader.result === 'string') {
          const newImage = {
            path: file.name,
            data: reader.result,
          };
          await agent.uploadImage(newImage);
          const newImages = await agent.getImages();
          dispatch({
            type: 'imagesLoaded',
            images: newImages,
          });
          onClickImage(newImage);
        }
      });
      reader.readAsDataURL(file);
    },
    [agent, dispatch, onClickImage]
  );

  return (
    <List
      searchPlaceholder="Search images..."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <input
        ref={fileInputRef}
        hidden
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
        {showImages.map((image) => {
          return (
            <div
              key={image.path}
              className="entry"
              onClick={() => onClickImage(image)}
            >
              <div
                className="preview"
                style={{
                  backgroundImage: `url(${image.data})`,
                }}
              />
              <span className="name">{removeExtension(image.path)}</span>
            </div>
          );
        })}
      </div>
    </List>
  );
};

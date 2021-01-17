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
import { ImageInfo } from '../model/messages/ImageInfo';
import removeExtension from '../util/removeExtension';

export interface Props {
  onClickImage: (image: ImageInfo) => void;
}

export const ImagesList: React.FC<Props> = ({ onClickImage }) => {
  const [, dispatch] = useGlobalState();
  const { agent, images } = useConnectedAgent();

  const [showImages, setShowImages] = useState(images); // TODO
  const [searchTerm, setSearchTerm] = useState('');
  useLayoutEffect(() => {
    setShowImages(
      images
        .filter((i) => filterImage(searchTerm, i))
        .sort((a, b) => a.path.localeCompare(b.path))
    );
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

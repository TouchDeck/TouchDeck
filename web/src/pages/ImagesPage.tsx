import React, { useCallback, useState } from 'react';
import { ImagesList } from '../components/ImagesList';
import { ImageInfo } from '../model/messages/ImageInfo';
import Button from '../components/Button';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import removeExtension from '../util/removeExtension';

export const ImagesPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();

  const deleteImage = useCallback(
    async (image: ImageInfo) => {
      await agent.deleteImage(image.path);
      setSelectedImage(undefined);
      const newImages = await agent.getImages();
      dispatch({
        type: 'imagesLoaded',
        images: newImages,
      });
    },
    [agent, dispatch]
  );

  return (
    <main className="images-page">
      <ImagesList onClickImage={setSelectedImage} />
      {selectedImage && (
        <div className="properties">
          <h3 className="name">{removeExtension(selectedImage.path)}</h3>
          <img src={selectedImage.data} alt="" />
          <div className="actions">
            <Button
              icon="trash"
              negative
              onClick={() => deleteImage(selectedImage)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

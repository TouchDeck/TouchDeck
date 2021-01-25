import React, { useCallback, useState } from 'react';
import { ImagesList } from '../components/ImagesList';
import { ImageInfo } from '../model/messages/ImageInfo';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { ImageProperties } from '../components/ImageProperties';

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
        <ImageProperties
          image={selectedImage}
          onDelete={() => deleteImage(selectedImage)}
          onClose={() => setSelectedImage(undefined)}
        />
      )}
    </main>
  );
};

import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { ImageInfo } from 'touchdeck-model';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import { ImageProperties } from '../components/ImageProperties';
import { SimpleList } from '../components/SimpleList';
import { removeExtension } from '../util/removeExtension';
import { Button } from '../components/Button';

export const ImagesPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();
  const [, dispatch] = useGlobalState();
  const { agent, images } = useConnectedAgent();

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
          setSelectedImage(newImage);
        }
      });
      reader.readAsDataURL(file);
    },
    [agent, dispatch, setSelectedImage]
  );

  return (
    <main className="images-page config-page">
      <SimpleList
        entries={images}
        entryName={(i) => removeExtension(i.path)}
        entryPreviewUrl={(i) => i.data}
        onClickEntry={setSelectedImage}
        searchPlaceholder="Search images..."
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
      </SimpleList>
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

import React, { useState } from 'react';
import { ImagesList } from '../components/ImagesList';
import { ImageInfo } from '../model/messages/ImageInfo';

export const ImagesPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo>();

  return (
    <main className="images-page">
      <ImagesList onClickImage={setSelectedImage} />
      {selectedImage && (
        <div className="properties">
          <h3 className="name">{selectedImage.path}</h3>
          <img src={selectedImage.data} alt="" />
        </div>
      )}
    </main>
  );
};

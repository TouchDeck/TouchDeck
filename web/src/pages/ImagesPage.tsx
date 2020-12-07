import React, { useState } from 'react';
import { ImagesList } from '../components/ImagesList';

export const ImagesPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>();

  return (
    <main className="images-page">
      <ImagesList onClickImage={(path, image) => setSelectedImage(image)} />
      <div className="properties">
        <img src={selectedImage} alt="" />
      </div>
    </main>
  );
};

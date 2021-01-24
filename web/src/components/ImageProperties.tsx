import React from 'react';
import removeExtension from '../util/removeExtension';
import Button from './Button';
import { ImageInfo } from '../model/messages/ImageInfo';

export interface Props {
  image: ImageInfo;
  onDelete: () => void;
}

export const ImageProperties: React.FC<Props> = ({ image, onDelete }) => {
  return (
    <div className="image-properties">
      <h3 className="name">{removeExtension(image.path)}</h3>
      <img src={image.data} alt="" />
      <div className="actions">
        <Button icon="trash" negative onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

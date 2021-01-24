import React, { useCallback, useState } from 'react';
import removeExtension from '../util/removeExtension';
import Button from './Button';
import { ImageInfo } from '../model/messages/ImageInfo';
import TextInput from './input/TextInput';
import ButtonGroup from './ButtonGroup';
import { useConnectedAgent, useGlobalState } from '../state/appState';

export interface Props {
  image: ImageInfo;
  onDelete: () => void;
  onClose: () => void;
}

export const ImageProperties: React.FC<Props> = ({
  image,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState(removeExtension(image.path));
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();

  const renameImage = useCallback(async () => {
    await agent.renameImage(image.path, name);
    const newImages = await agent.getImages();
    dispatch({
      type: 'imagesLoaded',
      images: newImages,
    });
  }, [agent, dispatch, image.path, name]);

  return (
    <div className="image-properties">
      <TextInput className="name" value={name} onChange={setName} />
      <img src={image.data} alt="" />
      <div className="actions">
        <Button icon="trash" negative onClick={onDelete}>
          Delete
        </Button>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={renameImage} positive icon="save">
            Save
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import removeExtension from '../util/removeExtension';
import Button from './Button';
import { ImageInfo } from 'touchdeck-model';
import { TextInput } from './input/TextInput';
import ButtonGroup from './ButtonGroup';
import { useConnectedAgent, useGlobalState } from '../state/appState';
import getExtension from '../util/getExtension';

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
  const [, dispatch] = useGlobalState();
  const { agent } = useConnectedAgent();
  const [path, setPath] = useState('');
  const [name, setName] = useState('');
  const [extension, setExtension] = useState('');

  useEffect(() => {
    setPath(image.path);
    setName(removeExtension(image.path));
    setExtension(getExtension(image.path));
  }, [image.path]);

  const renameImage = useCallback(async () => {
    const newPath = `${name}.${extension}`;
    await agent.renameImage(path, newPath);
    setPath(newPath);

    const newImages = await agent.getImages();
    dispatch({
      type: 'imagesLoaded',
      images: newImages,
    });
  }, [name, extension, agent, path, dispatch]);

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

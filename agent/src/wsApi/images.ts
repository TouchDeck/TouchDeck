import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ImageMap } from '../model/messages/ImageMap';
import { IMAGES_DIR } from '../constants';
import listFiles from '../util/listFiles';
import { ImageInfo } from '../model/messages/ImageInfo';

export async function getImages(): Promise<ImageMap> {
  const images: ImageMap = {};
  const entries = await listFiles(IMAGES_DIR);

  // Turn all image files into a base-64 encoded data url.
  await Promise.all(
    entries.map(async (file) => {
      const extension = file.substring(file.lastIndexOf('.') + 1);
      const fileBuffer = await fs.readFile(resolve(IMAGES_DIR, file));
      images[file] = `data:image/${extension};base64,${fileBuffer.toString(
        'base64'
      )}`;
    })
  );

  return images;
}

export async function uploadImage(image: ImageInfo): Promise<void> {
  await fs.writeFile(resolve(IMAGES_DIR, image.path), image.data, {
    encoding: 'base64',
  });
}

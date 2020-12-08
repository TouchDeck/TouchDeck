import { promises as fs } from 'fs';
import { resolve } from 'path';
import { IMAGES_DIR } from '../constants';
import listFiles from '../util/listFiles';
import { ImageInfo } from '../model/messages/ImageInfo';

export async function getImages(): Promise<ImageInfo[]> {
  const entries = await listFiles(IMAGES_DIR);

  return Promise.all(
    entries.map(async (path) => {
      const extension = path.substring(path.lastIndexOf('.') + 1);
      const fileBuffer = await fs.readFile(resolve(IMAGES_DIR, path));
      return {
        path,
        data: `data:image/${extension};base64,${fileBuffer.toString('base64')}`,
      };
    })
  );
}

export async function uploadImage(image: ImageInfo): Promise<void> {
  await fs.writeFile(resolve(IMAGES_DIR, image.path), image.data, {
    encoding: 'base64',
  });
}

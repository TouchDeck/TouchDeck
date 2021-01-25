import { promises as fs } from 'fs';
import { resolve } from 'path';
import { IMAGES_DIR } from '../constants';
import listFiles from '../util/listFiles';
import { ImageInfo } from '../model/messages/ImageInfo';
import { Path } from '../model/messages/Path';
import { RenameImage } from '../model/messages/RenameImage';
import { assertInImagesDir } from '../util/assertInImagesDir';

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
  const [, fileData] = image.data.split(',', 2);
  await fs.writeFile(assertInImagesDir(image.path), fileData, {
    encoding: 'base64',
  });
}

export async function deleteImage({ path }: Path): Promise<void> {
  await fs.unlink(assertInImagesDir(path));
}

export async function renameImage({
  oldPath,
  newPath,
}: RenameImage): Promise<void> {
  await fs.rename(assertInImagesDir(oldPath), assertInImagesDir(newPath));
}

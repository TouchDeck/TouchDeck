import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ImageInfo, Path, RenameImage } from 'touchdeck-model';
import { IMAGES_DIR } from '../constants';
import listFiles from '../util/listFiles';
import { assertInDir } from '../util/assertInDir';

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
  await fs.writeFile(assertInDir(IMAGES_DIR, image.path), fileData, {
    encoding: 'base64',
  });
}

export async function deleteImage({ path }: Path): Promise<void> {
  await fs.unlink(assertInDir(IMAGES_DIR, path));
}

export async function renameImage({
  oldPath,
  newPath,
}: RenameImage): Promise<void> {
  await fs.rename(
    assertInDir(IMAGES_DIR, oldPath),
    assertInDir(IMAGES_DIR, newPath)
  );
}

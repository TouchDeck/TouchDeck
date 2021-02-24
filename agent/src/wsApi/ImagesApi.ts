import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ImageInfo, Path, RenameImage } from 'touchdeck-model';
import { singleton } from '../Injector';
import listFiles from '../util/listFiles';
import { IMAGES_DIR } from '../constants';
import { assertInDir } from '../util/assertInDir';

@singleton
export class ImagesApi {
  public constructor() {
    this.getImages = this.getImages.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.renameImage = this.renameImage.bind(this);
  }

  public async getImages(): Promise<ImageInfo[]> {
    const entries = await listFiles(IMAGES_DIR);

    return Promise.all(
      entries.map(async (path) => {
        const extension = path.substring(path.lastIndexOf('.') + 1);
        const fileBuffer = await fs.readFile(resolve(IMAGES_DIR, path));
        return {
          path,
          data: `data:image/${extension};base64,${fileBuffer.toString(
            'base64'
          )}`,
        };
      })
    );
  }

  public async uploadImage(image: ImageInfo): Promise<void> {
    const [, fileData] = image.data.split(',', 2);
    await fs.writeFile(assertInDir(IMAGES_DIR, image.path), fileData, {
      encoding: 'base64',
    });
  }

  public async deleteImage({ path }: Path): Promise<void> {
    await fs.unlink(assertInDir(IMAGES_DIR, path));
  }

  public async renameImage({ oldPath, newPath }: RenameImage): Promise<void> {
    await fs.rename(
      assertInDir(IMAGES_DIR, oldPath),
      assertInDir(IMAGES_DIR, newPath)
    );
  }
}

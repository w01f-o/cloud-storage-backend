import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private readonly STATIC_DIR = join(__dirname, '..', '..', 'static');

  private readonly USER_FILES_DIR = join(this.STATIC_DIR, 'files');
  private readonly PUBLIC_FILES_DIR = join(this.STATIC_DIR, 'public');

  public getUserFilePath(fileName: string = ''): string {
    return join(this.USER_FILES_DIR, fileName);
  }

  public getPublicFilePath(fileName: string = ''): string {
    return join(this.PUBLIC_FILES_DIR, fileName);
  }

  public async saveFile(
    file: File,
    options?: { isPublic: boolean }
  ): Promise<string> {
    const fileName = `${Date.now()}-${uuid()}${extname(file.originalname)}`;
    const currentDir = options?.isPublic
      ? this.PUBLIC_FILES_DIR
      : this.USER_FILES_DIR;

    const filePath = join(currentDir, fileName);

    await mkdir(currentDir, {
      recursive: true,
    });
    await writeFile(filePath, file.buffer);

    return fileName;
  }

  public async deletePublicFile(fileName: string): Promise<string> {
    const filePath = join(this.PUBLIC_FILES_DIR, fileName);

    await unlink(filePath);

    return fileName;
  }

  public async deleteUserFile(fileName: string): Promise<string> {
    const filePath = join(this.USER_FILES_DIR, fileName);

    await unlink(filePath);

    return fileName;
  }
}

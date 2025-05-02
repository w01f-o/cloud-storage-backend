import { DatabaseService } from '@/database/database.service';
import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { UserStorageResponse } from './responses/user-storage.response';

@Injectable()
export class StorageService {
  constructor(private readonly database: DatabaseService) {}

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

  public async getUserStorage(userId: string): Promise<UserStorageResponse> {
    const { usedSpace, freeSpace, capacity, files } =
      await this.database.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          usedSpace: true,
          freeSpace: true,
          capacity: true,
          files: {
            select: {
              mimeType: true,
              resolvedType: true,
              size: true,
            },
          },
        },
      });

    const typeMap = new Map<
      string,
      Pick<UserStorageResponse['files'][number], 'resolvedType' | 'size'>
    >();

    for (const { mimeType, resolvedType, size } of files) {
      const entry = typeMap.get(mimeType);

      if (entry) {
        entry.size += size;
      } else {
        typeMap.set(mimeType, { resolvedType, size });
      }
    }

    const aggregatedFiles = [...typeMap.entries()].map(([mimeType, data]) => ({
      mimeType,
      resolvedType: data.resolvedType,
      size: data.size,
    }));

    return {
      files: aggregatedFiles,
      space: {
        used: usedSpace,
        free: freeSpace,
        total: capacity,
      },
    };
  }
}

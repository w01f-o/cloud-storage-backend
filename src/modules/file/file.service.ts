import { DatabaseService } from '@/core/database/database.service';
import { FolderService } from '@/modules/folder/folder.service';
import { StorageService } from '@/modules/storage/storage.service';
import { defaultPaginator, PaginatedResult } from '@/shared/paginator/paginate';
import { File } from '@nest-lab/fastify-multer';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Folder, Prisma, User } from '@prisma/client';
import * as mime from 'mime-types';
import { UpdateFileDto } from './dto/update.dto';
import { ResolvedFileTypes } from './enums/resolved-file-types.enum';
import { FileNotFoundException } from './exceptions/FileNotFound.exception';
import { NotEnoughSpaceException } from './exceptions/NotEnoughSpace.exception';
import { FindAllFilesQuery } from './queries/find-all.query';
import { FileResponse } from './responses/file.response';
import { resolvedFileTypesByMimetype } from './types/resolved-file-types';

@Injectable()
export class FileService {
  public constructor(
    private readonly database: DatabaseService,
    @Inject(forwardRef(() => FolderService))
    private readonly folderService: FolderService,
    private readonly storageService: StorageService
  ) {}

  private async decreaseUserFreeSpace(
    userId: string,
    size: number | bigint
  ): Promise<User> {
    return this.database.user.update({
      where: { id: userId },
      data: {
        usedSpace: {
          increment: size,
        },
        freeSpace: {
          decrement: size,
        },
      },
    });
  }

  private async increaseUserFreeSpace(
    userId: string,
    size: number | bigint
  ): Promise<User> {
    return this.database.user.update({
      where: { id: userId },
      data: {
        usedSpace: {
          decrement: size,
        },
        freeSpace: {
          increment: size,
        },
      },
    });
  }

  private async updateFolderSize(
    folderId: string,
    size: number
  ): Promise<Folder> {
    return this.database.folder.update({
      where: {
        id: folderId,
      },
      data: {
        size: {
          increment: size,
        },
      },
    });
  }

  private getFileTypes(fileName: string): {
    resolvedType: ResolvedFileTypes;
    mimeType: string;
  } {
    const mimeType = mime.lookup(fileName) || ResolvedFileTypes.OTHER;

    return {
      resolvedType:
        resolvedFileTypesByMimetype[mimeType] ?? ResolvedFileTypes.OTHER,
      mimeType,
    };
  }

  public async findAll(
    userId: string,
    query: FindAllFilesQuery
  ): Promise<PaginatedResult<FileResponse>> {
    return defaultPaginator<FileResponse, Prisma.FileFindManyArgs>(
      this.database.file,
      {
        where: {
          userId,
          displayName: {
            contains: query.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
        },
        omit: { userId: true },
      },
      { page: query.page, perPage: query.perPage }
    );
  }

  public async findAllByFolder(
    userId: string,
    folderId: string,
    query: FindAllFilesQuery
  ): Promise<PaginatedResult<FileResponse>> {
    await this.folderService.findOneById(userId, folderId);

    return defaultPaginator<FileResponse, Prisma.FileFindManyArgs>(
      this.database.file,
      {
        where: {
          userId,
          folderId,
          displayName: {
            contains: query.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        orderBy: {
          [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
        },
        omit: { userId: true },
      },
      { page: query.page, perPage: query.perPage }
    );
  }

  public async findOneById(userId: string, id: string): Promise<FileResponse> {
    const file = await this.database.file.findUnique({
      where: {
        id,
        userId,
      },
      omit: { userId: true },
    });

    if (!file) throw new FileNotFoundException();

    return file;
  }

  public async upload(
    user: User,
    folderId: string,
    file: File
  ): Promise<FileResponse> {
    const { id: userId, freeSpace } = user;

    if (freeSpace < BigInt(file.size)) throw new NotEnoughSpaceException();

    const fileName = await this.storageService.saveFile(file);
    const { size, originalname } = file;
    const { mimeType, resolvedType } = this.getFileTypes(originalname);

    await Promise.all([
      this.decreaseUserFreeSpace(userId, size),
      this.updateFolderSize(folderId, size),
    ]);

    return this.database.file.create({
      data: {
        name: fileName,
        mimeType,
        size: size,
        resolvedType,
        originalName: originalname,
        displayName: originalname,
        user: {
          connect: {
            id: userId,
          },
        },
        folder: {
          connect: {
            id: folderId,
          },
        },
      },
      omit: { userId: true },
    });
  }

  public async delete(userId: string, id: string): Promise<FileResponse> {
    const file = await this.findOneById(userId, id);

    const [deletedFile] = await Promise.all([
      this.database.file.delete({
        where: { id, userId },
        omit: { userId: true },
      }),
      this.storageService.deleteUserFile(file.name),
      this.increaseUserFreeSpace(userId, file.size),
    ]);

    return deletedFile;
  }

  public async update(
    userId: string,
    id: string,
    dto: UpdateFileDto
  ): Promise<FileResponse> {
    await this.findOneById(userId, id);

    return this.database.file.update({
      where: {
        id,
        userId,
      },
      data: {
        ...dto,
      },
      omit: { userId: true },
    });
  }
}

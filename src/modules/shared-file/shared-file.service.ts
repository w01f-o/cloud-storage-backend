import { DatabaseService } from '@/core/database/database.service';
import { FileService } from '@/modules/file/file.service';
import { FileResponse } from '@/modules/file/responses/file.response';
import { defaultPaginator, PaginatedResult } from '@/shared/paginator/paginate';
import { PaginationQuery } from '@/shared/paginator/pagination.query';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SharedFileNotFoundException } from './exceptions/SharedFileNotFound.exception';

@Injectable()
export class SharedFileService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly fileService: FileService
  ) {}

  public async findAll(
    userId: string,
    paginationQuery: PaginationQuery
  ): Promise<PaginatedResult<FileResponse>> {
    const result = await defaultPaginator<
      { file: FileResponse },
      Prisma.SharedFileFindManyArgs
    >(
      this.database.sharedFile,
      {
        where: {
          user: {
            id: userId,
          },
        },
        orderBy: [
          {
            [paginationQuery.sortBy ?? 'sharedAt']:
              paginationQuery.sortOrder ?? 'desc',
          },
          { id: 'asc' },
        ],
        select: { file: { omit: { userId: true } } },
      },
      { page: paginationQuery.page, perPage: paginationQuery.perPage }
    );

    return {
      ...result,
      list: result.list.map(({ file }) => file),
    };
  }

  public async findOneByFileId(fileId: string): Promise<FileResponse> {
    const { file } = await this.database.sharedFile.findFirst({
      where: {
        file: {
          id: fileId,
        },
      },
      select: { file: { omit: { userId: true } } },
    });

    return file;
  }

  public async share(userId: string, fileId: string): Promise<FileResponse> {
    const file = await this.fileService.findOneById(userId, fileId);

    if (!file) throw new SharedFileNotFoundException();

    const { file: sharedFile } = await this.database.sharedFile.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        file: {
          connect: {
            id: fileId,
          },
        },
      },
      select: { file: { omit: { userId: true } } },
    });

    await this.database.file.update({
      where: {
        id: fileId,
      },
      data: {
        isShared: true,
      },
    });

    return { ...sharedFile, isShared: true };
  }

  public async unshare(userId: string, fileId: string): Promise<FileResponse> {
    const file = await this.fileService.findOneById(userId, fileId);

    if (!file) throw new SharedFileNotFoundException();

    const { file: sharedFile } = await this.database.sharedFile.delete({
      where: {
        fileId_userId: {
          fileId,
          userId,
        },
        userId,
      },
      select: { file: { omit: { userId: true } } },
    });

    await this.database.file.update({
      where: {
        id: fileId,
      },
      data: {
        isShared: false,
      },
    });

    return { ...sharedFile, isShared: false };
  }
}

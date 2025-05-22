import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  defaultPaginator,
  PaginatedResult,
} from 'src/_shared/paginator/paginate';
import { PaginationQuery } from 'src/_shared/paginator/pagination.query';
import { DatabaseService } from 'src/database/database.service';
import { FileService } from 'src/file/file.service';
import { SharedFileNotFoundException } from './exceptions/SharedFileNotFound.exception';
import { SharedFileResponse } from './responses/shared-file.response';

@Injectable()
export class SharedFileService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly fileService: FileService
  ) {}

  public async findAll(
    userId: string,
    paginationQuery: PaginationQuery
  ): Promise<PaginatedResult<SharedFileResponse>> {
    return defaultPaginator<SharedFileResponse, Prisma.SharedFileFindManyArgs>(
      this.database.sharedFile,
      {
        where: {
          user: {
            id: userId,
          },
        },
        include: { file: { omit: { userId: true, updatedAt: true } } },
        orderBy: {
          sharedAt: 'desc',
        },
      },
      { page: paginationQuery.page, perPage: paginationQuery.perPage }
    );
  }

  public async findOneByFileId(fileId: string): Promise<SharedFileResponse> {
    return this.database.sharedFile.findFirst({
      where: {
        file: {
          id: fileId,
        },
      },
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });
  }

  public async share(
    userId: string,
    fileId: string
  ): Promise<SharedFileResponse> {
    const file = await this.fileService.findOneById(userId, fileId);

    if (!file) throw new SharedFileNotFoundException();

    const sharedFile = await this.database.sharedFile.create({
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
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });

    await this.database.file.update({
      where: {
        id: fileId,
      },
      data: {
        isShared: true,
      },
    });

    return sharedFile;
  }

  public async unshare(
    userId: string,
    fileId: string
  ): Promise<SharedFileResponse> {
    const file = await this.fileService.findOneById(userId, fileId);

    if (!file) throw new SharedFileNotFoundException();

    const sharedFile = await this.database.sharedFile.delete({
      where: {
        fileId_userId: {
          fileId,
          userId,
        },
        userId,
      },
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });

    await this.database.file.update({
      where: {
        id: fileId,
      },
      data: {
        isShared: false,
      },
    });

    return sharedFile;
  }
}

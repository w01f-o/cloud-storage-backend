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

  public async findOneById(
    userId: string,
    fileId: string
  ): Promise<SharedFileResponse> {
    const file = await this.database.sharedFile.findUnique({
      where: {
        id: fileId,
        userId,
      },
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });

    if (!file) throw new SharedFileNotFoundException();

    return file;
  }

  public async findOneByLink(link: string): Promise<SharedFileResponse> {
    const file = await this.database.sharedFile.findUnique({
      where: {
        link,
      },
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });

    if (!file) throw new SharedFileNotFoundException();

    return file;
  }

  public async share(
    userId: string,
    fileId: string
  ): Promise<SharedFileResponse> {
    await this.fileService.findOneById(userId, fileId);

    return this.database.sharedFile.create({
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
  }

  public async unshare(
    userId: string,
    sharedFileId: string
  ): Promise<SharedFileResponse> {
    await this.findOneById(userId, sharedFileId);

    return this.database.sharedFile.delete({
      where: {
        id: sharedFileId,
        userId,
      },
      include: { file: { omit: { userId: true, updatedAt: true } } },
    });
  }
}

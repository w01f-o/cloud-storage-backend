import { FileService } from '@/file/file.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  defaultPaginator,
  PaginatedResult,
} from 'src/_shared/paginator/paginate';
import { DatabaseService } from 'src/database/database.service';
import { CreateFolderDto } from './dto/create.dto';
import { UpdateFolderDto } from './dto/update.dto';
import { FolderNotFoundException } from './exceptions/FolderNotFound.exception';
import { FindAllFoldersQuery } from './queries/find-all.query';
import { FolderResponse } from './responses/folder.response';

@Injectable()
export class FolderService {
  public constructor(
    private readonly database: DatabaseService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService
  ) {}

  public async findAll(
    userId: string,
    query: FindAllFoldersQuery
  ): Promise<PaginatedResult<FolderResponse>> {
    return defaultPaginator<FolderResponse, Prisma.FolderFindManyArgs>(
      this.database.folder,
      {
        where: {
          userId,
          name: {
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

  // public async findAllByParent(
  //   userId: string,
  //   parentId: string,
  //   query: FindAllFoldersQuery
  // ): Promise<PaginatedResult<FolderResponse>> {
  //   return defaultPaginator<FolderResponse, Prisma.FolderFindManyArgs>(
  //     this.database.folder,
  //     {
  //       where: {
  //         userId,
  //         parentId,
  //         name: {
  //           contains: query.search,
  //           mode: Prisma.QueryMode.insensitive,
  //         },
  //       },
  //       orderBy: {
  //         [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
  //       },
  //       omit: { userId: true },
  //     },
  //     { page: query.page, perPage: query.perPage }
  //   );
  // }

  public async findOneById(
    userId: string,
    folderId: string
  ): Promise<FolderResponse> {
    const folder = await this.database.folder.findUnique({
      where: {
        id: folderId,
        userId,
      },
      omit: { userId: true },
    });

    if (!folder) throw new FolderNotFoundException();

    return folder;
  }

  public async create(
    userId: string,
    dto: CreateFolderDto
  ): Promise<FolderResponse> {
    return this.database.folder.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      omit: { userId: true },
    });
  }

  // public async createByParent(
  //   userId: string,
  //   parentId: string,
  //   dto: CreateFolderDto
  // ): Promise<FolderResponse> {
  //   await this.findOneById(userId, parentId);

  //   return this.database.folder.create({
  //     data: {
  //       ...dto,
  //       user: {
  //         connect: {
  //           id: userId,
  //         },
  //       },
  //       parent: {
  //         connect: {
  //           id: parentId,
  //         },
  //       },
  //     },
  //     include: { children: true },
  //     omit: { userId: true },
  //   });
  // }

  public async update(
    userId: string,
    folderId: string,
    dto: UpdateFolderDto
  ): Promise<FolderResponse> {
    await this.findOneById(userId, folderId);

    return this.database.folder.update({
      where: {
        id: folderId,
        userId,
      },
      data: {
        ...dto,
      },
      omit: { userId: true },
    });
  }

  public async delete(
    userId: string,
    folderId: string
  ): Promise<FolderResponse> {
    const { files } = await this.database.folder.findUnique({
      where: {
        id: folderId,
        userId,
      },
      include: {
        files: { select: { id: true } },
      },
    });

    await Promise.allSettled(
      files.map(({ id }) => this.fileService.delete(userId, id))
    );

    return this.database.folder.delete({
      where: {
        id: folderId,
        userId,
      },
      omit: { userId: true },
    });
  }
}

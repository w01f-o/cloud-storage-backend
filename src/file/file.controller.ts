import { PaginatedResult } from '@/_shared/paginator/paginate';
import { PaginationQuery } from '@/_shared/paginator/pagination.query';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UseAuth } from '@/auth/decorators/use-auth.decorator';
import { StorageService } from '@/storage/storage.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { FileAreRequiredException } from './exceptions/FileAreRequired.exception';
import { FileService } from './file.service';
import { FindAllFilesQuery } from './queries/find-all.query';
import { FileResponse } from './responses/file.response';

@UseAuth()
@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly storageService: StorageService
  ) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: FindAllFilesQuery
  ): Promise<PaginatedResult<FileResponse>> {
    return this.fileService.findAll(userId, query);
  }

  @Get('folder/:folderId')
  async findAllByFolder(
    @CurrentUser('id') userId: string,
    @Param('folderId') folderId: string,
    @Query() paginationQuery: PaginationQuery
  ): Promise<PaginatedResult<FileResponse>> {
    return this.fileService.findAllByFolder(userId, folderId, paginationQuery);
  }

  @Get(':id')
  async findOneById(
    @CurrentUser('id') userId: string,
    @Param('id') fileId: string
  ): Promise<FileResponse> {
    return this.fileService.findOneById(userId, fileId);
  }

  @Get('download/:id')
  async download(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('id') userId: string,
    @Param('id') fileId: string
  ): Promise<StreamableFile> {
    const file = await this.fileService.findOneById(userId, fileId);
    const filePath = this.storageService.getUserFilePath(file.name);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Length': file.size,
    });

    return new StreamableFile(createReadStream(filePath));
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('folder/:folderId')
  async upload(
    @CurrentUser() user: User,
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<FileResponse> {
    if (!file) throw new FileAreRequiredException();

    return this.fileService.upload(user, folderId, file);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id') fileId: string
  ): Promise<FileResponse> {
    return this.fileService.delete(userId, fileId);
  }
}

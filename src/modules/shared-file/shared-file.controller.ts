import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UseAuth } from '@/modules/auth/decorators/use-auth.decorator';
import { FileResponse } from '@/modules/file/responses/file.response';
import { StorageService } from '@/modules/storage/storage.service';
import { PaginatedResult } from '@/shared/paginator/paginate';
import { PaginationQuery } from '@/shared/paginator/pagination.query';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { createReadStream } from 'fs';
import { SharedFileService } from './shared-file.service';

@Controller('shared_files')
export class SharedFileController {
  constructor(
    private readonly sharedFileService: SharedFileService,
    private readonly storageService: StorageService
  ) {}

  @UseAuth()
  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() paginationQuery: PaginationQuery
  ): Promise<PaginatedResult<FileResponse>> {
    return this.sharedFileService.findAll(userId, paginationQuery);
  }

  @Get(':fileId')
  async findOneByFileId(
    @Param('fileId') fileId: string
  ): Promise<FileResponse> {
    return this.sharedFileService.findOneByFileId(fileId);
  }

  @Get('download/:fileId')
  async download(
    @Res({ passthrough: true }) reply: FastifyReply,
    @Param('fileId') fileId: string
  ): Promise<StreamableFile> {
    const file = await this.sharedFileService.findOneByFileId(fileId);
    const filePath = this.storageService.getUserFilePath(file.name);

    reply.headers({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Length': file.size.toString(),
    });

    return new StreamableFile(createReadStream(filePath));
  }

  @UseAuth()
  @Post(':fileId')
  async share(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string
  ): Promise<FileResponse> {
    return this.sharedFileService.share(userId, fileId);
  }

  @UseAuth()
  @Delete(':fileId')
  async unshare(
    @CurrentUser('id') userId: string,
    @Param('fileId') fileId: string
  ): Promise<FileResponse> {
    return this.sharedFileService.unshare(userId, fileId);
  }
}

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
import { PaginatedResult } from 'src/_shared/paginator/paginate';
import { PaginationQuery } from 'src/_shared/paginator/pagination.query';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { StorageService } from 'src/storage/storage.service';
import { SharedFileResponse } from './responses/shared-file.response';
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
  ): Promise<PaginatedResult<SharedFileResponse>> {
    return this.sharedFileService.findAll(userId, paginationQuery);
  }

  @UseAuth()
  @Get(':id')
  async findOneById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ): Promise<SharedFileResponse> {
    return this.sharedFileService.findOneById(userId, id);
  }

  @Get('link/:link')
  async findOneByLink(
    @Param('link') link: string
  ): Promise<SharedFileResponse> {
    return this.sharedFileService.findOneByLink(link);
  }

  @Get('download/:link')
  async download(
    @Res({ passthrough: true }) reply: FastifyReply,
    @Param('link') link: string
  ): Promise<StreamableFile> {
    const { file } = await this.sharedFileService.findOneByLink(link);
    const filePath = this.storageService.getUserFilePath(file.name);

    reply.headers({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Length': file.size.toString(),
    });

    return new StreamableFile(createReadStream(filePath));
  }

  @UseAuth()
  @Post(':id')
  async share(
    @CurrentUser('id') userId: string,
    @Param('id') fileId: string
  ): Promise<SharedFileResponse> {
    return this.sharedFileService.share(userId, fileId);
  }

  @UseAuth()
  @Delete(':id')
  async unshare(
    @CurrentUser('id') userId: string,
    @Param('id') sharedFileId: string
  ): Promise<SharedFileResponse> {
    return this.sharedFileService.unshare(userId, sharedFileId);
  }
}

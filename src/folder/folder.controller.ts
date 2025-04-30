import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedResult } from 'src/_shared/paginator/paginate';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { CreateFolderDto } from './dto/create.dto';
import { UpdateFolderDto } from './dto/update.dto';
import { FolderService } from './folder.service';
import { FindAllFoldersQuery } from './queries/find-all.query';
import { FolderResponse } from './responses/folder.response';

@Controller('folders')
@UseAuth()
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: FindAllFoldersQuery
  ): Promise<PaginatedResult<FolderResponse>> {
    return this.folderService.findAll(userId, query);
  }

  // @Get('parent/:parentId')
  // async findAllByParent(
  //   @CurrentUser('id') userId: string,
  //   @Param('parentId') parentId: string,
  //   @Query() query: FindAllFoldersQuery
  // ): Promise<PaginatedResult<FolderResponse>> {
  //   return this.folderService.findAllByParent(userId, parentId, query);
  // }

  @Get(':id')
  async findOneById(
    @CurrentUser('id') userId: string,
    @Param('id') folderId: string
  ): Promise<FolderResponse> {
    return this.folderService.findOneById(userId, folderId);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFolderDto
  ): Promise<FolderResponse> {
    return this.folderService.create(userId, dto);
  }

  // @Post('parent/:parentId')
  // async createByParent(
  //   @CurrentUser('id') userId: string,
  //   @Param('parentId') parentId: string,
  //   @Body() dto: CreateFolderDto
  // ): Promise<FolderResponse> {
  //   return this.folderService.createByParent(userId, parentId, dto);
  // }

  @Patch(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') folderId: string,
    @Body() dto: UpdateFolderDto
  ): Promise<FolderResponse> {
    return this.folderService.update(userId, folderId, dto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id') folderId: string
  ): Promise<FolderResponse> {
    return this.folderService.delete(userId, folderId);
  }
}

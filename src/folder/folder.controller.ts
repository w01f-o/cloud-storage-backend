import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest } from 'src/types/request.type';
import { UpdateFolderDto } from './dto/update.dto';

@Controller('folder')
@UseGuards(AuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('last_updated')
  public async getLast(@Req() req: CustomRequest) {
    const { user } = req;
    const folders = await this.folderService.getLastUpdated(user);

    return folders;
  }

  @Get()
  public async getAll(@Req() req: CustomRequest) {
    const { user, query } = req;
    const search = query.search as string;

    const folders = await this.folderService.getAll(user, search);

    return folders;
  }

  @Get(':id')
  public async getOne(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;

    const folder = await this.folderService.getOne(user, id);

    return folder;
  }

  @Post()
  public async create(
    @Req() req: CustomRequest,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    const { user } = req;

    const folder = await this.folderService.create(user, createFolderDto);

    return folder;
  }

  @Delete(':id')
  public async remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;
    const folder = await this.folderService.remove(user, id);

    return folder;
  }

  @Patch(':id')
  public async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    const { user } = req;
    const folder = await this.folderService.changeColor(
      user,
      id,
      updateFolderDto,
    );

    return folder;
  }
}

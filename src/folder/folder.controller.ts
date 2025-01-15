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

    return await this.folderService.getLastUpdated(user);
  }

  @Get()
  public async getAll(@Req() req: CustomRequest) {
    const { user, query } = req;
    const search = query.search as string;
    console.log(user);
    return await this.folderService.getAll(user, search);
  }

  @Get(':id')
  public async getOne(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;

    return await this.folderService.getOne(user, id);
  }

  @Post()
  public async create(
    @Req() req: CustomRequest,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    const { user } = req;

    return await this.folderService.create(user, createFolderDto);
  }

  @Delete(':id')
  public async remove(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;

    return await this.folderService.remove(user, id);
  }

  @Patch(':id')
  public async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    const { user } = req;

    return await this.folderService.changeColor(user, id, updateFolderDto);
  }
}

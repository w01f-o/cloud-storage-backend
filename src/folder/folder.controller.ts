import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll(@Req() req: Request) {
    const { userId, folderId } = req.query;
    const { refreshToken } = req.cookies;

    if (userId && !folderId) {
      return this.folderService.getAll(userId as string);
    }

    if (userId && folderId) {
      return this.folderService.getOne(userId as string, folderId as string);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body('name') createFolderDto: CreateFolderDto) {
    return this.folderService.create(createFolderDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folderService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('color/:id')
  changeColor(@Param('id') id: string, @Body('color') color: string) {
    return this.folderService.changeColor(id, color);
  }
}

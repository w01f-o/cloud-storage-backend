import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Shared_fileService } from './shared_file.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest } from 'src/types/request.type';
import * as fs from 'node:fs';
import { Response } from 'express';
import * as path from 'node:path';

@Controller('shared_file')
export class Shared_fileController {
  constructor(private readonly sharedFileService: Shared_fileService) {}

  @UseGuards(AuthGuard)
  @Get()
  public async getSharedFiles(@Req() req: CustomRequest) {
    const { user } = req;

    return this.sharedFileService.getSharedFiles(user);
  }

  @Get(':fileId')
  public async getSharedFile(@Param('fileId') fileId: string) {
    return this.sharedFileService.getFileById(fileId);
  }

  @Get('data/:link')
  public async getFileByLibk(@Param('link') link: string) {
    return this.sharedFileService.getFile(link);
  }

  @Get('download/:link')
  public async getFile(@Param('link') link: string, @Res() res: Response) {
    const file = await this.sharedFileService.getFile(link);

    const filePath = path.resolve('static', file.localName);
    const fileStream = fs.createReadStream(filePath);
    const filename = encodeURIComponent(
      `${file.localName.split('-').shift().trim()}.${file.localName.split('.').pop()}`,
    );

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': file.size,
    });

    return fileStream.pipe(res);
  }

  @UseGuards(AuthGuard)
  @Post(':sharedfileId')
  public async shareFile(
    @Req() req: CustomRequest,
    @Param('sharedfileId') sharedfileId: string,
  ) {
    const { user } = req;

    return this.sharedFileService.shareFile(user, sharedfileId);
  }

  @UseGuards(AuthGuard)
  @Delete(':sharedfileId')
  public async deleteSharedFile(@Param('sharedfileId') sharedfileId: string) {
    return this.sharedFileService.deleteSharedFile(sharedfileId);
  }
}

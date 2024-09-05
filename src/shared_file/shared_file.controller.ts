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

@Controller('shared_file')
export class Shared_fileController {
  constructor(private readonly sharedFileService: Shared_fileService) {}

  @Get(':link')
  public async getFile(
    @Param() link: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const filePath = await this.sharedFileService.getFile(link);
    const fileStream = fs.createReadStream(filePath);

    return fileStream.pipe(res);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  public async shareFile(@Req() req: CustomRequest, @Param() id: string) {
    const { user } = req;

    return this.sharedFileService.shareFile(user, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async deleteSharedFile(@Param() id: string) {
    return this.sharedFileService.deleteSharedFile(id);
  }
}

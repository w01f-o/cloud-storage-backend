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
import { SharedFileService } from './shared-file.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest } from 'src/types/request.type';
import * as fs from 'node:fs';
import { Response } from 'express';

@Controller('shared-file')
export class SharedFileController {
  constructor(private readonly sharedFileService: SharedFileService) {}

  @Get(':id')
  public async getFile(
    @Param() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const filePath = await this.sharedFileService.getFile(id);
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

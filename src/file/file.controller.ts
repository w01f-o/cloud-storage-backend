import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CustomRequest } from 'src/types/request.type';
import { UploadFileDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import * as fs from 'node:fs';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id')
  public async download(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const filePath = await this.fileService.download(id);
    const fileStream = fs.createReadStream(filePath);

    return fileStream.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @Req() req: CustomRequest,
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const uploadedFile = await this.fileService.upload(
      user,
      uploadFileDto,
      file,
    );

    return uploadedFile;
  }

  @Delete(':id')
  public async delete(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;
    const file = await this.fileService.delete(user, id);

    return file;
  }

  @Post('rename/:id')
  public async rename(
    @Req() req: CustomRequest,
    @Body() name: string,
    @Param('id') id: string,
  ) {
    const { user } = req;
    const file = await this.fileService.rename(user, name, id);

    return file;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import * as path from 'node:path';
import { UpdateFileDto } from './dto/update.dto';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  public async getAll(@Req() req: CustomRequest) {
    const {
      user,
      query: { folder },
    } = req;
    const files = await this.fileService.getAll(user, folder as string);

    return files;
  }

  @Get('last_uploaded')
  public async getLast(@Req() req: CustomRequest) {
    const { user } = req;
    const files = await this.fileService.getLastUploaded(user);

    return files;
  }

  @Get(':id')
  public async download(@Res() res: Response, @Param('id') id: string) {
    const file = await this.fileService.download(id);
    const filePath = path.resolve('static', file.localName);

    const fileStream = fs.createReadStream(filePath);
    const filename = encodeURIComponent(
      `${file.localName.split('-').shift()}.${file.localName.split('.').pop()}`,
    );

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': file.size,
    });

    return fileStream.pipe(res);
  }

  @Post('')
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

  @Patch(':id')
  public async update(
    @Req() req: CustomRequest,
    @Body() updateFileDto: UpdateFileDto,
    @Param('id') id: string,
  ) {
    const { user } = req;
    const file = await this.fileService.update(user, updateFileDto, id);

    return file;
  }
}

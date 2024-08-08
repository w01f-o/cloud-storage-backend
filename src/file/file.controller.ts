import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CustomRequest } from 'src/types/request.type';
import { UploadFileDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public upload(
    @Req() req: CustomRequest,
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const uploadedFile = this.fileService.upload(user, uploadFileDto, file);

    return uploadedFile;
  }

  @Delete(':id')
  public delete(@Req() req: CustomRequest, @Param('id') id: string) {
    const { user } = req;
    const file = this.fileService.delete(user, id);

    return file;
  }

  @Post('rename/:id')
  public rename(
    @Req() req: CustomRequest,
    @Body() name: string,
    @Param('id') id: string,
  ) {
    const { user } = req;
    const file = this.fileService.rename(user, name, id);

    return file;
  }
}

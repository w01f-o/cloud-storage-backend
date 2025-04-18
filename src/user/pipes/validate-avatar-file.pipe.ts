import {
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const ValidateAvatarFilePipe = (): ParseFilePipe =>
  new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'image',
    })
    .addMaxSizeValidator({
      maxSize: 1024 * 1024 * 5,
    })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY });

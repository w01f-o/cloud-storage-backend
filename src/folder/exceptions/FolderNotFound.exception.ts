import { HttpException, HttpStatus } from '@nestjs/common';
import { FolderErrors } from '../enums/errors.enum';

export class FolderNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: FolderErrors.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

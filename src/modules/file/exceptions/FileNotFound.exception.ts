import { HttpException, HttpStatus } from '@nestjs/common';
import { FileErrors } from '../enums/errors.enum';

export class FileNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: FileErrors.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

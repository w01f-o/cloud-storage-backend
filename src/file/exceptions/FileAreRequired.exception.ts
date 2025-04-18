import { HttpException, HttpStatus } from '@nestjs/common';
import { FileErrors } from '../enums/errors.enum';

export class FileAreRequiredException extends HttpException {
  constructor() {
    super(
      {
        message: FileErrors.ARE_REQUIRED,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

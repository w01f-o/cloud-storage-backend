import { HttpException, HttpStatus } from '@nestjs/common';
import { SharedFileErrors } from '../enums/errors.enum';

export class SharedFileNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: SharedFileErrors.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';
import { FileErrors } from '../enums/errors.enum';

export class NotEnoughSpaceException extends HttpException {
  constructor() {
    super(
      {
        message: FileErrors.NOT_ENOUGH_SPACE,
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN
    );
  }
}

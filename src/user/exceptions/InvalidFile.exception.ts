import { HttpException, HttpStatus } from '@nestjs/common';
import { UserErrors } from '../enums/errors.enum';

export class InvalidFileException extends HttpException {
  constructor(error: UserErrors, cause?: string) {
    super(
      {
        message: error,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        cause,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}

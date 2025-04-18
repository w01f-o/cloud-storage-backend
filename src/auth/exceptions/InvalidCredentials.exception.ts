import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.INVALID_CREDENTIALS,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

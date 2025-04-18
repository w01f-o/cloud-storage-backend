import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class InvalidAccessTokenException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.INVALID_ACCESS_TOKEN,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

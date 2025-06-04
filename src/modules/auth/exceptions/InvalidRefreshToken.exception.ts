import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.INVALID_REFRESH_TOKEN,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

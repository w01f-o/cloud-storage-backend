import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class NoAccessTokenException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.NO_ACCESS_TOKEN,
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

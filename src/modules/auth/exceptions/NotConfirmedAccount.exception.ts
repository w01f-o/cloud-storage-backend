import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class NotConfirmedAccountException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.NOT_CONFIRMED_ACCOUNT,
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.USER_ALREADY_EXISTS,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

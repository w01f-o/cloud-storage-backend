import { HttpException, HttpStatus } from '@nestjs/common';
import { UserErrors } from '../enums/errors.enum';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        message: UserErrors.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

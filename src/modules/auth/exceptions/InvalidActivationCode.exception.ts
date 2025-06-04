import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrors } from '../enums/errors.enum';

export class InvalidActivationCodeException extends HttpException {
  constructor() {
    super(
      {
        message: AuthErrors.INVALID_ACTIVATION_CODE,
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

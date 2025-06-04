import { HttpException, HttpStatus } from '@nestjs/common';
import { FileErrors } from '../enums/errors.enum';

export class InvalidFileFormatException extends HttpException {
  constructor(allowedFormats?: string[]) {
    super(
      {
        message: FileErrors.INVALID_FORMAT,
        statusCode: HttpStatus.BAD_REQUEST,
        allowedFormats: `Allowed formats: ${allowedFormats.join(', ')}`,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

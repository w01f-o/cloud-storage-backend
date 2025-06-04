import { File } from '@nest-lab/fastify-multer';
import { Injectable, PipeTransform } from '@nestjs/common';
import { isMimeType } from 'class-validator';
import { UserErrors } from '../enums/errors.enum';
import { InvalidFileException } from '../exceptions/InvalidFile.exception';

@Injectable()
export class ValidateAvatarFilePipe implements PipeTransform {
  async transform(file: File | undefined): Promise<File> {
    if (!file || typeof file === 'function') {
      return undefined;
    }

    if (!isMimeType(file.mimetype) || !file.mimetype.startsWith('image/')) {
      throw new InvalidFileException(UserErrors.FILE_MUST_BE_IMAGE);
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new InvalidFileException(
        UserErrors.MAX_FILE_SIZE,
        'Max file size is 5 Mb'
      );
    }

    return file;
  }
}

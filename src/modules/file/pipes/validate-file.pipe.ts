import { File } from '@nest-lab/fastify-multer';
import { Injectable, PipeTransform } from '@nestjs/common';
import { FileAreRequiredException } from '../exceptions/FileAreRequired.exception';

@Injectable()
export class ValidateFilePipe implements PipeTransform {
  async transform(file: File | undefined): Promise<File> {
    if (!file || typeof file === 'function') {
      throw new FileAreRequiredException();
    }

    return file;
  }
}

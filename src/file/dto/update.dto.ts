import { MAX_FILE_NAME_LENGTH } from '@/_shared/constants/validation-constants';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  @MaxLength(MAX_FILE_NAME_LENGTH)
  name?: string;
}

import {
  MAX_FILE_NAME_LENGTH,
  MIN_FILE_NAME_LENGTH,
} from '@/_shared/constants/validation-constants';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  @Length(MIN_FILE_NAME_LENGTH, MAX_FILE_NAME_LENGTH)
  name?: string;
}

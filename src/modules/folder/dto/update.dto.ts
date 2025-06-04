import {
  MAX_FOLDER_NAME_LENGTH,
  MIN_FOLDER_NAME_LENGTH,
} from '@/shared/constants/validation-constants';
import { IsHexColor, IsOptional, IsString, Length } from 'class-validator';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  @Length(MIN_FOLDER_NAME_LENGTH, MAX_FOLDER_NAME_LENGTH)
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}

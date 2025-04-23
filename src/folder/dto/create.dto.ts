import { IsHexColor, IsString, Length } from 'class-validator';
import {
  MAX_FOLDER_NAME_LENGTH,
  MIN_FOLDER_NAME_LENGTH,
} from 'src/_shared/constants/validation-constants';

export class CreateFolderDto {
  @IsString()
  @Length(MIN_FOLDER_NAME_LENGTH, MAX_FOLDER_NAME_LENGTH)
  name: string;

  @IsHexColor()
  color: string;
}

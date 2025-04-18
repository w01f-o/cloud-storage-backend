import { IsHexColor, IsString, MaxLength } from 'class-validator';
import { MAX_FOLDER_NAME_LENGTH } from 'src/_shared/constants/validation-constants';

export class CreateFolderDto {
  @IsString()
  @MaxLength(MAX_FOLDER_NAME_LENGTH)
  name: string;

  @IsHexColor()
  color: string;
}

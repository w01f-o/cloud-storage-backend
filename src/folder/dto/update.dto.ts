import { IsHexColor, IsOptional, IsString, MaxLength } from 'class-validator';
import { MAX_FOLDER_NAME_LENGTH } from 'src/_shared/constants/validation-constants';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_FOLDER_NAME_LENGTH)
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}

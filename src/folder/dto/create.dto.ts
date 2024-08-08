import { IsHexColor, IsNotEmpty } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsHexColor()
  color: string;
}

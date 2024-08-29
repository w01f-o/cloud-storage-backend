import { IsNotEmpty } from 'class-validator';

export class UpdateFolderDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}

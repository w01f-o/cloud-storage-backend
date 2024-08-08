import { IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  folderId: string;
}

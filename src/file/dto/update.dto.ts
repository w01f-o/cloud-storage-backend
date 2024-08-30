import { IsNotEmpty } from 'class-validator';

export class UpdateFileDto {
  @IsNotEmpty()
  name: string;
}

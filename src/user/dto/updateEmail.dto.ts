import { IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @IsNotEmpty()
  email: string;
}
